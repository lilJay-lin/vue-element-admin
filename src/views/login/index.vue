<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
      class="card-box login-form">
      <h3 class="title">代金券管理后台</h3>
      <el-form-item prop="loginName">
        <span class="svg-container"><icon-svg icon-class="jiedianyoujian"></icon-svg></span>
        <el-input name="loginName" type="text" v-model="loginForm.loginName" autoComplete="on" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container"><icon-svg icon-class="mima"></icon-svg></span>
        <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password"
          placeholder="密码"></el-input>
      </el-form-item>
      <div id="popup-captcha" style="margin-bottom: 22px"></div>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    name: 'login',
    data() {
      const NAME_MESSAGE = '登录名开头必须是字母或下划线，其它为数字、字母和下划线组成'
      const validateLoginName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('登录名不能为空'))
        } else if (value.length < 3 || value.length > 32) {
          callback(new Error('登录名长度3到32位'))
        } else if (!/^[a-zA-Z_][a-zA-Z0-9_]{3,31}$/.test(value)) {
          callback(new Error(NAME_MESSAGE));
        } else {
          callback();
        }
      }

      const validatePass = (rule, value, callback) => {
        if (!/^[a-zA-Z0-9!@#\\$%\\^&\\*\\(\\)]{6,32}$/.test(value)) {
          callback(new Error('密码只能由大小写字母、数字和特殊字符(!@#$%^&*())组成'));
        } else {
          callback();
        }
      };
      return {
        publicKey: '',
        userId: '', /* 验证码用户ID */
        gtServerStatus: '',
        captchaObj: null,
        loginForm: {
          loginName: 'admin',
          password: '123456'
        },
        loginRules: {
          loginName: [
            { validator: validateLoginName, trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 6, max: 32, message: '密码长度6到32位', trigger: 'blur' },
            { trigger: 'blur', validator: validatePass }
          ]
        },
        loading: false
      }
    },
    methods: {
      handleLogin() {
        const me = this
        const validate = me.captchaObj.getValidate()
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(me.publicKey);
        if (!validate) {
          me.$message({
            message: '请先进行验证',
            type: 'error',
            duration: 2 * 1000
          })
          return
        }
        me.$refs.loginForm.validate(valid => {
          if (valid) {
            me.loading = true;
            me.$store.dispatch('LoginByName', {
              name: me.loginForm.loginName,
              password: encrypt.encrypt(me.loginForm.password),
              gt_server_status: this.gtServerStatus,
              user_id: this.user_id,
              geetest_challenge: validate.geetest_challenge,
              geetest_validate: validate.geetest_validate,
              geetest_seccode: validate.geetest_seccode
            }).then(() => {
              me.loading = false;
              me.$router.push({ path: '/' });
                // this.showDialog = true;
            }, () => {
              console.log('error')
              me.loading = false;
              me.captchaObj.reset()
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      initCaptcha () {
        const me = this
        me.$store.dispatch('GetPublicKey').then((key) => {
          me.publicKey = key
          me.$store.dispatch('Geetest').then(data => {
            me.userId = data.user_id
            me.gtServerStatus = data.offline
            data.offline = !data.offline
            delete data.user_id
            window.initGeetest(data, (captchaObj) => {
              me.captchaObj = captchaObj
              captchaObj.appendTo('#popup-captcha')
            })
          })
        })
      }
    },
    watch: {
      $route () {
        this.captchaObj = null
        this.initCaptcha()
      }
    },
    created() {
      this.initCaptcha()
    },
    destroyed() {
        // window.removeEventListener('hashchange', this.afterQRScan);
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 5px;
  }

  .login-container {
    @include relative;
    height: 100vh;
    background-color: #2d3a4b;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #eeeeee;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: #889aa4;
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: #eeeeee;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 370px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto 0;
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .forget-pwd {
      color: #fff;
    }
  }
</style>
