<template>
  <div class="login" :style="{ zoom: zoomScale }">
    <div class="login-content">
      <div class="login-head"></div>
      <div class="login-input">
        <div
          class="input-box"
          :class="[current === 1 ? 'input-box-sel' : 'input-box-com']"
        >
          <img
            class="prefix-icon"
            :src="
              current === 1
                ? require('../assets/images/login/icon-user-s.png')
                : require('../assets/images/login/icon-user.png')
            "
            alt=""
          />
          <el-input
            v-model="loginForm.username"
            type="text"
            placeholder="请输入账号"
            @focus="onFocus(1)"
          ></el-input>
          <img
            v-if="loginForm.username"
            class="close-icon cp"
            src="../assets/images/login/icon-close.png"
            alt=""
            @click="onClear(1)"
          />
        </div>
        <div
          class="input-box mar"
          :class="[current === 2 ? 'input-box-sel' : 'input-box-com']"
        >
          <img
            class="prefix-icon"
            :src="
              current === 2
                ? require('../assets/images/login/icon-password-s.png')
                : require('../assets/images/login/icon-password.png')
            "
            alt=""
          />
          <el-input
            v-model="loginForm.password"
            :type="isShowPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            @focus="onFocus(2)"
            @keyup.enter.native="handleLogin"
          ></el-input>
          <img
            v-if="loginForm.password"
            style="margin: 0 8px 0 0"
            class="close-icon cp"
            src="../assets/images/login/icon-close.png"
            alt=""
            @click="onClear(2)"
          />
          <img
            v-if="loginForm.password"
            class="close-icon cp"
            :src="
              isShowPassword
                ? require('../assets/images/login/icon-hide.png')
                : require('../assets/images/login/icon-show.png')
            "
            alt=""
            @click="onShowPassword"
          />
        </div>
        <div class="login-code">
          <div
            class="input-box wd"
            :class="[current === 3 ? 'input-box-sel' : 'input-box-com']"
          >
            <img
              class="prefix-icon"
              :src="
                current === 3
                  ? require('../assets/images/login/icon-code-s.png')
                  : require('../assets/images/login/icon-code.png')
              "
              alt=""
            />
            <el-input
              v-model="loginForm.code"
              type="text"
              placeholder="请输入验证码"
              @focus="onFocus(3)"
              @keyup.enter.native="handleLogin"
            ></el-input>
            <img
              v-if="loginForm.code"
              class="close-icon cp"
              src="../assets/images/login/icon-close.png"
              alt=""
              @click="onClear(3)"
            />
          </div>
          <div class="code-box">
            <img class="code-img cp" :src="codeUrl" @click="getCode" />
          </div>
        </div>
        <div class="login-btn cp" @click.prevent="handleLogin">进入系统</div>
      </div>
    </div>
    <!--  底部  -->
    <!-- <div class="el-login-footer">
      <span>Copyright © 2018-2022 ruoyi.vip All Rights Reserved.</span>
    </div> -->
  </div>
</template>

<script>
import fullScreen from "@/mixins/fullScreen";
import { getCodeImg } from "@/api/login";
// import Cookies from "js-cookie";
// import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  mixins: [fullScreen],
  data() {
    return {
      current: undefined,
      isShowPassword: false,
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        code: "",
        uuid: "",
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
    };
  },
  created() {
    this.getCode();
  },
  methods: {
    onFocus(idx) {
      this.current = idx;
    },
    onClear(idx) {
      switch (idx) {
        case 1:
          this.loginForm.username = "";
          break;
        case 2:
          this.loginForm.password = "";
          break;
        case 3:
          this.loginForm.code = "";
          break;

        default:
          break;
      }
    },
    onShowPassword() {
      this.isShowPassword = !this.isShowPassword;
    },
    getCode() {
      getCodeImg().then((res) => {
        this.captchaEnabled =
          res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    handleLogin() {
      if (!this.loginForm.username) {
        this.$message.error("请输入您的账号");
        return;
      }
      if (!this.loginForm.password) {
        this.$message.error("请输入您的密码");
        return;
      }
      if (!this.loginForm.code) {
        this.$message.error("请输入验证码");
        return;
      }
      this.loading = true;
      this.$store
        .dispatch("Login", this.loginForm)
        .then(() => {
          this.$router.push({ path: "/visual-panel" }).catch(() => {});
        })
        .catch(() => {
          this.loading = false;
          if (this.captchaEnabled) {
            this.loginForm.code = "";
            this.getCode();
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-input--medium .el-input__inner {
  background: transparent;
  border: none;
  font-size: 18px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #fff;
  line-height: 18px;
}
::v-deep input:-webkit-autofill {
  -webkit-text-fill-color: #fff !important;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  caret-color: #fff;
  transition: background-color 5000s ease-in-out 0s;
}
input {
  background-color: transparent;
}
.login {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-image: url("../assets/images/login/login-bg.png");
  background-size: 100% 100%;
}
.login-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 187px;
}
.login-head {
  width: 538px;
  height: 29px;
  background-image: url("../assets/images/login/login-head.png");
  background-size: 100% 100%;
}
.login-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 821px;
  height: 478px;
  background-image: url("../assets/images/login/login-input.png");
  background-size: 100% 100%;
  margin-top: 33px;
  padding: 97px 81px 53px 91px;
}
.input-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 649px;
  height: 60px;
  padding: 15px 24px;
  border-radius: 4px;
}
.mar {
  margin-top: 29px;
  margin-bottom: 30px;
}
.wd {
  width: 390px;
}
.input-box-com {
  background: rgba($color: #c3d7ff, $alpha: 0.15);
}
.input-box-sel {
  background: rgba($color: #015af1, $alpha: 0.3);
  border: 2px solid #3681ff;
}
.login-code {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}
.code-box {
  width: 226px;
  height: 60px;
  background: #142952;
  border-radius: 4px;
  margin-left: 33px;
}
.code-img {
  width: 100%;
  height: 100%;
}
.prefix-icon {
  width: 30px;
  height: 30px;
  margin-right: 12px;
}
.close-icon {
  width: 22px;
  height: 22px;
}
.login-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 360px;
  height: 60px;
  background: linear-gradient(0deg, #0a2985, #0060ff);
  border-radius: 4px;
  margin-top: 29px;
  font-size: 22px;
  color: #c9dbff;
  line-height: 22px;
}
.cp {
  cursor: pointer;
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
