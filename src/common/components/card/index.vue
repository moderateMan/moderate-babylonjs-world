<template>
    <a-card hoverable
        :style="{ width: '360px', marginRight: '150px', padding: '0px 0px 0px 0px',backgroundColor: 'rgb(148 151 166 / 38%)' }">
        <template #cover>
      <div
        :style="{
          height: '204px',
          overflow: 'hidden',
        }"
      >
        <img
          :style="{ width: '100%', transform: 'translateY(-20px)' }"
          alt="dessert"
          src="https://s1.imagehub.cc/images/2022/10/27/c1ede234aeb41d1a0216fe5bc4d1c642aad1eed8.jpg942w_531h_progressive.webp"
        />
      </div>
    </template>
        <slot></slot>
    </a-card>
</template>