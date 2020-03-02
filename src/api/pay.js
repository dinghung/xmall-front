import http from './public'
// 支付
export const payment = (params) => {
  return http.fetchPost('/pay/payment', params)
}