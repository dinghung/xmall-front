<template>
  <div class="w" style="padding-bottom: 100px;">
    <y-shelf title="支付订单">
      <div slot="content">
        <div class="box-inner order-info">
          <h3>提交订单成功，请选择支付方式</h3>
          <p class="payment-detail">支付链接在 <span>1 小时后</span>失效，超时后请重新点击支付。</p>
          <p class="payment-detail">我们会在您完成支付后的 72 小时内发货</p>
          <p class="payment-detail" style="color:red">请仔细检查您的支付信息，如遇到问题请联系客服</p>
        </div>
        <div class="pay-info" style="display:none">
          <form id="rppaysubmit" name="rppaysubmit" action="http://gateway.i1dh.com/scanPay/initPay" method="POST">
          <input type="hidden" name="productName" v-model="productName"/>
          <input type="hidden" name="orderNo" v-model="orderNo"/>
          <input type="hidden" name="payKey" v-model="payKey"/>
          <input type="hidden" name="orderPrice" v-model="orderPrice"/>
          <input type="hidden" name="orderIp" v-model="orderIp"/>
          <input type="hidden" name="orderDate" v-model="orderDate"/>
          <input type="hidden" name="orderTime" v-model="orderTime"/>
          <input type="hidden" name="orderPeriod" v-model="orderPeriod"/>
          <input type="hidden" name="returnUrl" v-model="returnUrl"/>
          <input type="hidden" name="notifyUrl" v-model="notifyUrl"/>
          <input type="hidden" name="sign" id="sign" v-model="sign"/>
          <input type="hidden" name="payType" v-model="payType"/>
          <input type="submit" value="提交"  style="display:none"/>
    </form>
        </div>
        <!--支付方式-->
        <div class="pay-type">
          <div class="p-title">支付方式</div>
          <div class="pay-item">
            <div :class="{active:payTypeFlag==1}" @click="payTypeFlag=1"><img src="/static/images/alipay@2x.png" alt=""></div>
            <!-- <div :class="{active:payTypeFlag==2}" @click="payTypeFlag=2"><img src="/static/images/weixinpay@2x.png" alt=""></div>
            <div :class="{active:payTypeFlag==3}" @click="payTypeFlag=3"><img src="/static/images/qqpay.png" alt=""></div> -->
          </div>
        </div>

        <div>
          <div class="box-inner">
            <div>
              <span>
                订单金额：
              </span>
              <em><span>¥</span>{{orderTotal.toFixed(2)}}</em>
              <span>
                实际应付金额：
              </span>
              <em><span>¥</span>{{money}}</em>
              <y-button :text="payNow"
                        :classStyle="submit?'main-btn':'disabled-btn'"
                        style="width: 120px;height: 40px;font-size: 16px;line-height: 38px"
                        @btnClick="paySuc()"
              ></y-button>
            </div>
          </div>
        </div>

      </div>
    </y-shelf>
    <!--地址信息-->
    <div class="p-msg w">
      <div class="confirm-detail">
        <div class="info-title">收货信息</div>
        <p class="info-detail">姓名：{{userName}}</p>
        <p class="info-detail">联系电话：{{tel}}</p>
        <p class="info-detail">详细地址：{{streetName}}</p></div>
    </div>
    <div class="confirm-table-title">
      <span class="name">商品信息</span>
      <div>
        <span class="price">单价</span>
        <span class="num">数量</span>
        <span class="subtotal">小计</span>
      </div>
    </div>
    <!--商品-->
    <div class="confirm-goods-table">
      <div class="cart-items" v-for="(item,i) in cartList" :key="i">
        <div class="name">
          <div class="name-cell ellipsis">
            <a @click="goodsDetails(item.productId)" title="" target="_blank">{{item.productName}}</a>
          </div>
        </div>
        <div class="n-b">
          <div class="price">¥ {{item.salePrice}}</div>
          <div class="goods-num">{{item.productNum}}</div>
          <div class="subtotal">
            <div class="subtotal-cell"> ¥ {{item.salePrice * item.productNum}}<br></div>
          </div>
        </div>
      </div>
    </div>
    <!--合计-->
    <div class="order-discount-line">
      <p style="font-size: 14px;font-weight: bolder;"> <span style="padding-right:47px">商品总计：</span>
        <span style="font-size: 16px;font-weight: 500;line-height: 32px;">¥ {{orderTotal}}</span>
      </p>
      <p><span style="padding-right:30px">运费：</span><span style="font-weight: 700;">+ ¥ 0.00</span></p>
    </div>
  </div>
</template>
<script>
  import YShelf from '/components/shelf'
  import YButton from '/components/YButton'
  import { getOrderDet } from '/api/goods'
  import { getStore } from '/utils/storage'
  import { payment } from '/api/pay.js'
  export default {
    data () {
      return {
        payTypeFlag: 1,
        addList: {},
        cartList: [],
        addressId: 0,
        productId: '',
        num: '',
        userId: '',
        orderTotal: 0,
        userName: '',
        tel: '',
        streetName: '',
        payNow: '立刻支付',
        submit: true,
        nickName: '',
        money: '1.00',
        info: '',
        email: '',
        orderId: '',
        type: '',
        moneySelect: '1.00',
        isCustom: false,
        maxLength: 30,
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
        sign: '',
        payKey: '',
        payType: ''
      }
    },
    computed: {
      // 选中的总价格
      // checkPrice () {
      //   let totalPrice = 0
      //   this.cartList && this.cartList.forEach(item => {
      //     if (item.checked === '1') {
      //       totalPrice += (item.productNum * item.salePrice)
      //     }
      //   })
      //   return totalPrice
      // }
    },
    methods: {
      messageFail (m) {
        this.$message.error({
          message: m
        })
      },
      goodsDetails (id) {
        window.open(window.location.origin + '#/goodsDetails?productId=' + id)
      },
      _getOrderDet (orderId) {
        let params = {
          params: {
            orderId: this.orderId
          }
        }
        getOrderDet(params).then(res => {
          this.cartList = res.result.goodsList
          this.userName = res.result.addressInfo.userName
          this.tel = res.result.addressInfo.tel
          this.streetName = res.result.addressInfo.streetName
          this.orderTotal = res.result.orderTotal
          this.money = res.result.orderTotal
        })
      },
      paySuc () {
        this.payNow = '支付中...'
        this.submit = false
        if (this.payTypeFlag === 1) {
          this.type = 'Alipay'
        } else if (this.payTypeFlag === 2) {
          this.type = 'Wechat'
        } else if (this.payTypeFlag === 3) {
          this.type = 'QQ'
        } else {
          this.type = '其它'
        }
        document.forms['rppaysubmit'].submit()
      },
      _alipay (orderId) {
        let params = {
          params: {
            'orderId': orderId
          }
        }
        payment(params).then(res => {
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
            this.payKey = res.result.payKey
            this.payType = res.result.payType
          }
        })
      }
    },
    created () {
      this.userId = getStore('userId')
      this.orderId = this.$route.query.orderId
      if (this.orderId) {
        this._getOrderDet(this.orderId)
        this._alipay(this.orderId)
      } else {
        this.$router.push({path: '/'})
      }
    },
    components: {
      YShelf,
      YButton
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

  /*支付类型*/
  .pay-type {
    margin: 0 auto;
    width: 90%;
    padding-bottom: 30px;
    .p-title {
      font-size: 18px;
      line-height: 40px;
      padding: 0 10px;
      position: relative;
      &:before {
        content: ' ';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        border-bottom: 1px solid #ccc;
      }
    }

  }

  .pay-type {
    .pay-item {
      display: flex;
      align-items: center;
      div {
        margin-top: 20px;
        width: 175px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #E5E5E5;
        cursor: pointer;
        border-radius: 6px;
        margin-right: 10px;
        background: #FAFAFA;
        &.active {
          border-color: #6A8FE5;
          background: #fff;
        }
        img {
          display: block;
          height: 34px;
          margin: 8px auto;
        }
      }
    }
  }

  .box-inner {
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

  .confirm-detail {
    padding: 0 30px 25px;
    border-top: 1px solid #d5d5d5;
    .info-title {
      height: 14px;
      margin: 30px 0 17px;
      line-height: 14px;
      font-weight: bolder;
      color: #333;
    }
    .info-detail {
      line-height: 24px;
      color: #666;
    }
  }

  .confirm-table-title {
    padding: 3px 0 0 33px;
    border-top: 1px solid #D5D5D5;
    line-height: 54px;
    font-weight: bolder;
    color: #000;
    display: flex;
    justify-content: space-between;
    span {
      display: inline-block;
      width: 175px;
      text-align: left;
    }
    .price {
      padding-left: 80px;
    }
    .num {
      padding-left: 75px;
    }
    .subtotal {
      padding-left: 72px;
    }
  }

  .confirm-goods-table {
    border-top: 1px solid #D5D5D5;
    .cart-items {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      a {
        color: #333;
      }
    }
    .n-b {
      display: flex;
      align-items: center;
      justify-content: center;
      > div {
        color: #626262;
        font-weight: 700;
        width: 175px;
        text-align: center;
      }
    }
  }

  .order-discount-line {
    padding: 22px 30px 53px;
    border-top: 1px solid #D5D5D5;
    line-height: 24px;
    text-align: right;
    font-size: 12px;
    &:first-child {
      line-height: 32px;
      text-align: right;
      font-size: 14px;
      font-weight: bolder;
    }
  }

  .name {
    width: 40%;
  }

  .name-cell {
    padding-left: 33px;
  }

  .input {
    width:30%;
    margin:0 0 1vw 38px;
  }

  .pay-info {
    margin-top: -2vw;
    text-align: center;
  }

  .money-select {
    width: 31%;
    padding-left: 10px;
    margin-bottom: 1vw;
  }
</style>

