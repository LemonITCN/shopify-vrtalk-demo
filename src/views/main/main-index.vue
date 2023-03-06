<template>
  <div class="main-index-impl">
    <div class="goods-list">
      <a-card hoverable class="goods-item" v-for="(goods,gIndex) in  goodsList" :key="gIndex">
        <template #cover>
          <img alt="example" :src="goods.coverImage"/>
        </template>
        <a-card-meta :title="goods.name">
          <template #description>{{ goods.description }}</template>
        </a-card-meta>
        <template #actions>
          <shopping-cart-outlined @click="addToCheckout(goods.variantId)"/>
        </template>
      </a-card>
      <!--      <div class="goods-item">-->
      <!--        <div class="goods-name">{{ goods.name }}</div>-->
      <!--        <a-button type="primary">Loading</a-button>-->
      <!--      </div>-->
    </div>
    <div class="checkout-line">
      checkout id: {{ checkoutId }}
    </div>
    <div class="checkout-line">
      checkout url: {{ checkoutUrl }}
    </div>
    <div class="actions-line">
      <a-button @click="gotoSubmit" type="primary">去结算</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, type Ref, ref } from 'vue'
import Client from 'shopify-buy'
import Goods from '@/model/goods'
import { ShoppingCartOutlined } from '@ant-design/icons-vue'
import { notification } from 'ant-design-vue'

const goodsList: Ref<Goods[]> = ref([])
const checkoutId = ref('')
const checkoutUrl = ref('')
let client: Client | null = null

onMounted(() => {
  init()
})

function init () {
  client = Client.buildClient({
    apiVersion: '2023-01',
    domain: 'shop.vrtalk.online',
    storefrontAccessToken: '5ea9e8b228e9727e783a3251cfad41bf'
  })
  client.product.fetchAll().then((products) => {
    // Do something with the products
    products.forEach(product => {
      console.log('product id:', product, product.variants[0].id)
      const goods = new Goods()
      goods.id = product.id
      goods.name = product.title
      goods.coverImage = product.images[0].src
      goods.description = product.description
      goods.variantId = product.variants[0].id
      goodsList.value.push(goods)
    })
  })
  client.checkout.create().then((checkout) => {
    // Do something with the checkout
    checkoutId.value = checkout.id
    checkoutUrl.value = checkout.webUrl
    console.log('创建了新的checkout', checkout)
  })
}

function addToCheckout (variantId: string) {
  const lineItemsToAdd = [
    {
      variantId: variantId,
      quantity: 2,
      customAttributes: [{ key: 'test', value: 'vrtalk' }]
    }
  ]


  if (client != null) {
    client.checkout.addLineItems(checkoutId.value, lineItemsToAdd).then((checkout) => {
      console.log(checkout)
      notification.success({
        message: '加入购物车成功'
      })
    })
  }
}

function gotoSubmit () {
  window.open(checkoutUrl.value)
}
</script>

<style scoped lang="scss">
.goods-list {
  display: flex;
  flex-direction: row;
  align-items: start;
  border: 1px solid #cccccc;
  margin: 30px;

  .goods-item {
    width: 220px;
    margin: 20px;
  }
}

.checkout-line {
  padding: 10px 30px;
}

.actions-line{
  padding: 10px 30px;
}
</style>