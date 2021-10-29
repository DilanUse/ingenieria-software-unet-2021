const BaseController = require('../../http/controllers/base.controller');
const service = require('./user.service');
const repository = require('./user.repository');
const sharedFunctions = require('../shared.functions');
const {
  getQueryFindForUsersByRole,
  getQueryFindForMerchantsUsers,
  getQueryFindForUsersToShare,
  roleIsAdmin,
} = require('./user.functions');

const { TYPE: CAMPAIGN_TYPE } = require('../../http/constants/common-campaign.constants');
const campaignConstants = require('../../http/constants/common-campaign.constants');
const { ROLES_SYSTEM } = require('../shared.constant');

const {
  ADMIN_OWNER, MERCHANT_OWNER,
} = require('../shared.constant').ROLES_SYSTEM.ROLES;

/**
 * UserController class
 */

class UserController extends BaseController {
  constructor() {
    super({
      service,
      selectFilter: '-password',
      fieldsDelete: [
        { firstProperty: 'password' },
      ],
    });
    this.service = service;
    this.selectFilter = '-password';
    this.fieldsDelete = [
      { firstProperty: 'password' },
    ];
    this.repository = repository;
  }

  async getAllHandler(req) {
    const {
      tenantIdPayloadToken: tenantId,
      userIdPayloadToken: userId,
      userRolePayloadToken: userRole,
    } = req.params;

    const {
      limit, skip, filters, sortBy, populate, filtersMatch,
    } = req.query;

    const queryFind = getQueryFindForUsersByRole({
      userId,
      tenantId,
      userRole,
      filters,
      filtersMatch,
    });

    const fieldSort = sharedFunctions.getFieldSort(sortBy);

    const data = await this.service.getAll({
      queryFind, skip, limit, fieldSort,
    }).select(this.selectFilter).populate(populate);

    const count = await this.service.getCount(queryFind);

    return { data, count };
  }

  async getAllMerchantsHandler(req) {
    const {
      limit, skip, filters, sortBy, populate, filtersMatch,
    } = req.query;

    const queryFind = getQueryFindForMerchantsUsers({
      filters, filtersMatch,
    });

    const fieldSort = sharedFunctions.getFieldSort(sortBy);

    const data = await this.service.getAll({
      queryFind, skip, limit, fieldSort,
    }).select(this.selectFilter).populate(populate);

    const count = await this.service.getCount(queryFind);

    return { data, count };
  }

  async getAllUsersToShareHandler(req) {
    const {
      tenantIdPayloadToken: tenantId,
      userIdPayloadToken: userId,
      userRolePayloadToken: userRole,
    } = req.params;

    const {
      limit, skip, filters, sortBy, populate, filtersMatch,
    } = req.query;

    const queryFind = getQueryFindForUsersToShare({
      userId,
      tenantId,
      userRole,
      filters,
      filtersMatch,
    });

    const fieldSort = sharedFunctions.getFieldSort(sortBy);

    const data = await this.service.getAll({
      queryFind, skip, limit, fieldSort,
    }).select(this.selectFilter).populate(populate);

    const count = await this.service.getCount(queryFind);

    return { data, count };
  }

  async inviteUsersHandler(req) {
    const {
      emails,
      permissions,
      admin,
      owner,
    } = req.body;

    const {
      tenantIdPayloadToken: tenant,
      userIdPayloadToken: creator,
      userRolePayloadToken: userRole,
    } = req.params;

    const {
      populate,
    } = req.query;

    if (owner && userRole !== MERCHANT_OWNER && userRole !== ADMIN_OWNER) throw new Error('Error only owner');

    return this.service.inviteUsers({
      emails, permissions, admin, owner, userRole, tenant, creator, populate,
    });
  }

  async getStatusHandler(req) {
    const { email } = req.params;
    const user = await this.service.getUserByEmail(email);

    if (user) {
      return user.status;
    }

    return 'status';
  }

  async updateAvatarHandler(req) {
    return this.service.updateOne({
      payload: {
        avatar: req.body,
      },
      id: req.params.userIdPayloadToken,
    });
  }

  async updateOneHandler(req) {
    const { userRolePayloadToken: userRole } = req.params;

    if (userRole !== MERCHANT_OWNER && userRole !== ADMIN_OWNER && req.body.owner) throw new Error('Error only owner');

    const prefixRole = roleIsAdmin(userRole)
      ? ROLES_SYSTEM.PREFIXES.ADMIN
      : ROLES_SYSTEM.PREFIXES.MERCHANT;

    let suffixRole;

    if (req.body.owner) suffixRole = ROLES_SYSTEM.SUFFIXES.OWNER;
    else if (req.body.admin) suffixRole = ROLES_SYSTEM.SUFFIXES.ADMIN;
    else suffixRole = ROLES_SYSTEM.SUFFIXES.USER;

    return this.service.updateOne({
      payload: {
        role: {
          name: `${prefixRole}-${suffixRole}`,
          permissions: req.body.permissions,
        },
        status: req.body.status,
      },
      id: req.params.id,
    });
  }

  async deleteAvatarHandler(req) {
    return this.service.updateOne({
      payload: {
        avatar: null,
      },
      id: req.params.userIdPayloadToken,
    });
  }

  async updateProfileHandler(req) {
    const user = await this.service.updateOne({
      payload: req.body,
      id: req.params.userIdPayloadToken,
    });

    return {
      name: user.name,
      email: user.email,
    };
  }

  async updatePasswordHandler(req) {
    await this.service.updatePassword({
      payload: req.body,
      id: req.params.userIdPayloadToken,
    });

    return true;
  }

  async changeValueFlagsHandler(req) {
    const { userIdPayloadToken: userId } = req.params;
    const flagsForModification = req.body;

    let payloadUpdate = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(flagsForModification)) {
      payloadUpdate = {
        ...payloadUpdate,
        [`flags.${key}`]: value,
      };
    }

    return this.service.updateOne({
      id: userId,
      payload: payloadUpdate,
    });
  }

  async updateMarkersHandler(req) {
    const { userIdPayloadToken: userId } = req.params;

    return this.service.updateOne({
      id: userId,
      payload: {
        markers: req.body,
      },
    });
  }

  async getCurrentlyCampaignHandler(req) {
    const { nameService } = req.params;
    const { userIdPayloadToken: id } = req.params;

    return this.service.getCurrentlyCampaign({ id, nameService });
  }

  async saveDraftCampaignHandler(req) {
    const {
      campaignType,
      tenantIdPayloadToken: tenant,
      userIdPayloadToken: creator,
      id: campaignId,
    } = req.params;

    const hardDraft = JSON.parse(req.query.hardDraft || false);
    let payload = req.body;
    let campaignExist = false;
    payload.status = campaignConstants.STATUS.DRAFT;

    console.log(`campaignType ${campaignType} id ${campaignId}
    payload ${JSON.stringify(payload)} hardDraft ${hardDraft}`);

    if (!hardDraft) {
      if (campaignId) {
        // eslint-disable-next-line no-underscore-dangle
        payload._id = campaignId;
      }

      const userUpdated = await this.service.setDraftCampaign({
        userId: creator,
        campaignType,
        payload,
      });

      if (campaignId) {
        campaignExist = await this.campaignServices[campaignType].getOne(campaignId);
      }

      if (campaignExist) {
        payload = await this.campaignServices[campaignType].updateOne({
          payload,
          queryFind: {},
          idCampaign: campaignId,
        });
      }

      payload = userUpdated.campaignsDrafts[campaignType];
    } else {
      if (campaignId) {
        campaignExist = await this.campaignServices[campaignType].getOne(campaignId);
      }
      if (campaignExist) {
        payload = await this.campaignServices[campaignType].updateOne({
          payload,
          queryFind: {},
          idCampaign: campaignId,
        });
      } else {
        if (campaignId) {
          // eslint-disable-next-line no-underscore-dangle
          payload._id = campaignId;
        }

        payload = await this.campaignServices[campaignType].createOne({
          payload,
          queryFind: {},
          tenant,
          creator,
        });
      }

      await this.service.setDraftCampaign({
        userId: creator,
        campaignType,
        payload: null,
      });
    }

    return payload;
  }

  async discardDraftCampaignHandler(req) {
    const {
      campaignType,
      userIdPayloadToken: userId,
      id: campaignId,
    } = req.params;

    if (campaignId) {
      await this.campaignServices[campaignType].deleteOne(campaignId);
    }

    const userUpdated = await this.service.setDraftCampaign({
      userId,
      campaignType,
      payload: null,
    });

    return userUpdated.campaignsDrafts[campaignType];
  }
}

const singletonInstance = new UserController();

module.exports = singletonInstance;
