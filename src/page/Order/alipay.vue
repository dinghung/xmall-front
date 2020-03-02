<template>
  <div class="w" style="padding-bottom: 100px;">
    <form id="rppaysubmit" name="rppaysubmit" action="http://gateway.i1dh.com/scanPay/initPay" method="GET">
      <input type="hidden" name="productName" v-model="productName"/>
      <input type="hidden" name="orderNo" v-model="orderNo"/>
      <input type="hidden" name="orderPrice" v-model="orderPrice"/>
      <input type="hidden" name="orderIp" v-model="orderIp"/>
      <input type="hidden" name="orderDate" v-model="orderDate"/>
      <input type="hidden" name="orderTime" v-model="orderTime"/>
      <input type="hidden" name="orderPeriod" v-model="orderPeriod"/>
      <input type="hidden" name="returnUrl" v-model="returnUrl"/>
      <input type="hidden" name="notifyUrl" v-model="notifyUrl"/>
      <input type="hidden" name="sign" v-model="sign"/>
      <input type="submit" value="提交"  />
    </form>
  </div>
</template>
<script>
  import { getStore } from '/utils/storage'
  import { payment } from '/api/pay.js'
  export default {
    data () {
      return {
        orderId: '',
        productName: '',
        orderNo: '',
        orderPrice: '',
        orderIp: '',
        orderDate: '',
        orderTime: '',
        orderPeriod: '',
        returnUrl: '',
        notifyUrl: '',
        payUrl: '',
        sign: ''
      }
    },
    methods: {
      _alipay (orderId) {
        console.log(orderId)
        payment({orderId}).then(res => {
          if (res.success === true) {
            console.log(res)
            this.productName = res.result.productName
            this.orderNo = res.result.orderNo
            this.orderPrice = res.result.orderPrice
            this.orderIp = res.result.orderIp
            this.orderDate = res.result.orderDate
            this.orderTime = res.result.orderTime
            this.orderPeriod = res.result.orderPeriod
            this.returnUrl = res.result.returnUrl
            this.notifyUrl = res.result.notifyUrl
            this.payUrl = res.result.notifyUrl
            this.sign = res.result.sign
          } else {
            this.messageFail(res.message)
          }
        })
      },
      onSubmit () {
        document.forms['rppaysubmit'].orderId
      }
    },
    mounted () {
      this.onSubmit()
    },
    created () {
      let orderId = this.$route.query.orderId
      this._alipay(orderId)
      this.userId = getStore('userId')
    }
  }
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  .w {
    padding-top: 39px;
  }

  .order-info {
    padding: 60px 0 55px;
    color: #333;
    background: #fff !important;
    h3 {
      padding-bottom: 14px;
      line-height: 36px;
      text-align: center;
      font-size: 36px;
      color: #212121;
    }
    .payment-detail {
      text-align: center;
      line-height: 24px;
      font-size: 14px;
      color: #999;
    }
  }

  .box-inner {
    line-height: 60px;
    background: #f9f9f9;
    border-top: 1px solid #e5e5e5;
    box-sizing: border-box;
    > div {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding: 0 20px;
    }
    em {
      margin-left: 5px;
      font-size: 24px;
      color: #d44d44;
      font-weight: 700;
      margin-right: 20px;
      span {
        margin-right: 4px;
        font-size: 16px;
      }
    }
  }

  .box-btn {
    line-height: 60px;
    background: #f9f9f9;
    border-top: 1px solid #e5e5e5;
    box-sizing: border-box;
    > div {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 20px;
    }
    em {
      margin-left: 5px;
      font-size: 24px;
      color: #d44d44;
      font-weight: 700;
      margin-right: 20px;
      span {
        margin-right: 4px;
        font-size: 16px;
      }
    }
  }

  .payment-money {
    text-align: center;
    font-size: 30px;
    color: #d44d44;
    font-weight: 700;
  }

  .img-box{
    position: relative;
    width: 180px;
    height: auto;
    min-height: 168px;
    margin: 0 auto;
    padding: 6px;
    border: 1px solid #d3d3d3;
    box-shadow: 1px 1px 1px #ccc;
    display: inline-block;
  }

  .explain {
    margin: 5px 0 12px 0;
  }

  .pic{
    margin-top: 3px;
  }

  .fn-left{
    margin-left: -5px;
  }

  .fn-right{
    font-size: 13px;
    color: #4D4D4D;
    line-height: 18px;
    margin: -57px 0 0 33px;
  }

  .download-alipay {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    margin-top: -5px;
    font-size: 12px;
    color: #a6a6a6;
    text-decoration: underline;
    width: 25%;
    margin: 0 auto;
  }

  .qrguide-area {
    position: absolute;
    top: 113px;
    left: 713px;
    width: 204px;
    height: 183px;
    cursor: pointer;
  }

  .show-img{
    display: block;
  }

  .close-img{
    display: none;
  }

  .red {
    position: absolute;
    top: 482px;
    left: 1151px;
    width: 47px;
    height: 50px;
    cursor: pointer;
  }

  .el-dialog--small {
    width: 30%;
  }

  .qr-red {
    display: block;
    margin: 0 auto;
    width: 70%;
  }

  .count {
    display: flex;
    position: absolute;
    text-align: center;
    width: 230px;
    flex-direction: column;
    align-items: center;
    margin-left: calc(50% - 115px);
    margin-top: 0px;
    color: #222;
    margin-top: -18px;
  }
  
  .timeout{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(255,255,255,.95);
    color: #222;
    line-height: 200px;
    text-align: center;
    z-index: 1;
  }
</style>
