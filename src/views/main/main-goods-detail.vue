<template>
  <div class="main-goods-detail-impl">
    <a-spin :spinning="loadingState">
      <div class="goods-detail-area">
        <div class="left-area">
          <img :src="goods.coverImage" class="cover-image"/>
        </div>
        <div class="right-area">
          <div class="goods-name">{{ goods.name }}</div>
          <div class="goods-description">{{ goods.description }}</div>
          <div class="goods-price">{{ goods.price }}￥</div>
          <div class="goods-count">
            请选择购买数量：
            <a-input-number id="inputNumber" v-model:value="goodsCount" :min="1" :max="10"/>
          </div>
          <div class="actions-line">
            <a-button class="actions-btn" size="large" type="danger" @click="buyNow">立即购买</a-button>
            <a-button class="actions-btn" size="large" type="primary" @click="addToCart">加入购物车</a-button>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import Client from 'shopify-buy'
import Goods from '@/model/goods'
import { onMounted, ref } from 'vue'

const $route = useRoute()
const goods = ref(new Goods())
const goodsCount = ref(1)
const loadingState = ref(true)
let client: Client | null = null

onMounted(() => {
  // 8147573899567
  loadGoodsInfo('gid://shopify/Product/' + $route.query.id)
})

function loadGoodsInfo (id: string) {
  client = Client.buildClient({
    apiVersion: '2023-01',
    domain: 'shop.vrtalk.online',
    storefrontAccessToken: '5ea9e8b228e9727e783a3251cfad41bf'
  })
  client.product.fetch(id).then(product => {
    console.log(product)
    const thisGoods = new Goods()
    thisGoods.id = product.id
    thisGoods.name = product.title
    thisGoods.coverImage = product.images[0].src
    thisGoods.description = product.description
    thisGoods.variantId = product.variants[0].id
    thisGoods.price = product.variants[0].price.amount
    goods.value = thisGoods
    loadingState.value = false
  })
}

function buyNow () {
  loadingState.value = true
  if (client != null) {
    client.checkout.create().then((checkout) => {
      console.log('创建了新的checkout', checkout)
      const lineItemsToAdd = [
        {
          variantId: goods.value.variantId,
          quantity: goodsCount.value,
          customAttributes: [{ key: 'test', value: 'vrtalk' }]
        }
      ]
      if (client != null) {
        client.checkout.addLineItems(checkout.id, lineItemsToAdd).then((checkout) => {
          loadingState.value = false
          window.open(checkout.webUrl)
        })
      }
    })
  }
}

function addToCart () {

}

</script>

<style scoped lang="scss">
.main-goods-detail-impl {
  .goods-detail-area {
    display: flex;
    flex-direction: row;

    .left-area {
      margin: 20px;
      width: 40%;
      background-color: #f0f0f0;

      .cover-image {
        width: 100%;
      }
    }

    .right-area {
      margin: 20px;
      display: flex;
      flex-direction: column;

      .goods-name {
        font-size: 30px;
        font-weight: bold;
      }

      .goods-description {
        font-size: 15px;
        color: #aaaaaa;
        margin-top: 20px;
      }

      .goods-price {
        font-size: 30px;
        color: red;
        margin-top: 40px;
      }

      .goods-count {
        margin-top: 20px;
      }

      .actions-line {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        align-items: end;

        .actions-btn {
          margin-right: 20px;
        }
      }
    }
  }
}
</style>