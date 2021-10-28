function getUserAuthPayload({
  user, tenant,
}) {
  return {
    // eslint-disable-next-line no-underscore-dangle
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    tenant,
    creator: user.creator,
    campaignsDrafts: user.campaignsDrafts,
    markers: user.markers,
    flags: user.flags,
  };
}

function getUserTokenPayload(user) {
  // eslint-disable-next-line no-underscore-dangle
  if (!user || (!user._id && !user.id)) {
    throw new Error('The payload for the token needs a user id');
  }

  return {
    // eslint-disable-next-line no-underscore-dangle
    sub: user._id || user.id,
    tenant: (user.tenant) ? user.tenant._id : null,
    creator: (user.creator) ? user.creator : null,
  };
}

module.exports = {
  getUserAuthPayload,
  getUserTokenPayload,
};
