<template>
  <div class="main-vr-impl">
    <iframe class="vr-frame"
            src="https://playground.vrtalk.online/#/vr-visitor/40288af783eb33d00184045dc6626f1d"></iframe>
    <a-button type="primary" shape="circle" size="large" class="cart-enter" @click="enterCart">
      <template #icon>
        <shopping-cart-outlined/>
      </template>
    </a-button>
    <a-drawer
        v-model:visible="cartShowState"
        class="custom-class"
        title="我的购物车"
        placement="right">
      <template #extra>
        <a-button type="primary" @click="submitOrder" :disabled="cartItemList.length === 0">立即下单</a-button>
      </template>
      <div class="no-cart-item-tip">购物车是空的哦！</div>
      <div class="cart-item" v-for="(cartItem, cIndex) in cartItemList" :key="cIndex">
        <img class="cart-img" :src="cartItem.imageUrl"/>
        <div class="goods-right">
          <div class="goods-name">{{ cartItem.name }}</div>
          <a-input-number class="count-input" v-model:value="cartItem.count" :min="1" :max="99"/>
        </div>
        <a-popconfirm
            title="您确认要从购物车中移除吗?"
            ok-text="确认删除"
            cancel-text="取消"
            @confirm="removeCartItem(cIndex)">
          <a-button type="primary" shape="circle" class="delete-btn" danger ghost>
            <template #icon>
              <delete-outlined/>
            </template>
          </a-button>
        </a-popconfirm>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { type Ref, ref, watch } from 'vue'
import Client from 'shopify-buy'
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import type CartItem from '@/model/cart-item'

let client: Client | null = null
const cartShowState = ref(false)
const cartItemList: Ref<CartItem[]> = ref([])

watch(cartItemList, (value, oldValue) => {
  const cartStr = JSON.stringify(cartItemList.value)
  localStorage.setItem('vrtalk-cart', cartStr)
}, {
  deep: true
})

function init () {
  client = Client.buildClient({
    apiVersion: '2023-01',
    domain: 'shop.vrtalk.online',
    storefrontAccessToken: '5ea9e8b228e9727e783a3251cfad41bf'
  })
}

function enterCart () {
  const cartListStr = localStorage.getItem('vrtalk-cart')
  if (cartListStr && cartListStr !== '') {
    cartItemList.value = JSON.parse(cartListStr)
  }
  cartShowState.value = true
}

function removeCartItem (cartItemIndex: number) {
  cartItemList.value.splice(cartItemIndex, 1)
  localStorage.setItem('vrtalk-cart', JSON.stringify(cartItemList.value))
}

function submitOrder () {
  client = Client.buildClient({
    apiVersion: '2023-01',
    domain: 'shop.vrtalk.online',
    storefrontAccessToken: '5ea9e8b228e9727e783a3251cfad41bf'
  })
  client.checkout.create().then((newCheckout) => {
    const lineItemsToAdd: any[] = []
    cartItemList.value.forEach(cartItem => {
      lineItemsToAdd.push({
        variantId: cartItem.variantId,
        quantity: cartItem.count
      })
    })
    if (client != null) {
      client.checkout.addLineItems(newCheckout.id, lineItemsToAdd).then((checkout) => {
        console.log('下单啦！', newCheckout)
        window.open(newCheckout.webUrl)
      })
    }
  })
}
</script>

<style scoped lang="scss">
.vr-frame {
  border: none;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.cart-enter {
  position: absolute;
  right: 30px;
  bottom: 100px;
}

.no-cart-item-tip {
  font-size: 20px;
  color: #bbbbbb;
  text-align: center;
  margin-top: 150px;
}

.cart-item {
  display: flex;
  flex-direction: row;
  padding: 10px;
  margin-bottom: 12px;
  background-color: #f6f6f6;
  position: relative;

  .cart-img {
    width: 120px;
    min-width: 120px;
    height: 90px;
    object-fit: cover;
    margin-right: 10px;
    background-color: #f0f0f0;
  }

  .goods-right {
    .goods-name {
      font-weight: bold;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      /* ! autoprefixer: off */
      -webkit-box-orient: vertical;
    }

    .count-input {
      margin-top: 12px;
    }
  }

  .delete-btn {
    position: absolute;
    right: 12px;
    bottom: 12px;
  }
}
</style>