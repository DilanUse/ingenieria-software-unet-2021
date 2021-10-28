
export default {
  data() {
    return {
      activeModalVerify: false,
      sendVerificationCode: false,
      recordToVerify: null,
    };
  },
  watch: {
    lastCreated(val) {
      this.recordToVerify = val;
      this.sendVerificationCode = true;
      this.activeModalVerify = true;
    },
    activeModalVerify(val) {
      if (!val) {
        this.sendVerificationCode = false;
      }
    },
  },
  methods: {
    afterVerifySenderId() {
      this.activeModalVerify = false;
    },
  },
};
