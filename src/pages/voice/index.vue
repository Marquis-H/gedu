<template>
  <div class="container">
    <van-tabs animated :active="active" @change="onChange" color="#6416a6">
      <van-tab v-for="tab in tabs" :title="tab.title" :key="tab.id">
        <div class="cell" v-for="(item, idx) in tab.data" :key="idx">
          <span>{{item.title}}</span>
          <van-cell-group>
            <van-cell v-for="(section, i) in item.section" :key="i" :title="section.title" is-link/>
          </van-cell-group>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Toast from "../../../static/vant/toast/toast";

export default {
  data() {
    return {
      active: 0,
      tabs: [
        {
          id: 1,
          title: "剑雅13",
          data: [
            {
              title: "Test 1",
              section: [
                {
                  id: 1,
                  title: "Section 1"
                },
                {
                  id: 2,
                  title: "Section 2"
                }
              ]
            },
            {
              title: "Test 2",
              section: [
                {
                  id: 1,
                  title: "Section 1"
                },
                {
                  id: 2,
                  title: "Section 2"
                }
              ]
            }
          ]
        },
        {
          id: 1,
          title: "剑雅12",
          data: [
            {
              title: "Test 1",
              section: [
                {
                  id: 1,
                  title: "Section 1"
                }
              ]
            },
            {
              title: "Test 2",
              section: [
                {
                  id: 1,
                  title: "Section 1"
                },
                {
                  id: 2,
                  title: "Section 2"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    onChange(event) {}
  },
  onShow() {},
  created() {}
};
</script>

<style scoped>
.container {
  vertical-align: middle;
}
.cell span{
  font-size: 14px;
  padding-left: 15px;
  color: #455a64
}
</style>
