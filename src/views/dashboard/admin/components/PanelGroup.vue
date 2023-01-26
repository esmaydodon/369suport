<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="24" :md="12" class="card-panel-col">
      <router-link :to="'/expedientes/porrecepcionar'" class="link-type">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-expedientes icon-primary">
            <count-to
              :start-val="0"
              :end-val="datos.total_areas"
              :duration="3500"
            />
          </div>
          <div class="descripction-expedientes">
            <div class="card-panel-text">
              <span class="title">Expedientes por recepcionar</span>
              <br>
              <span class="description">
                Expedientes que le han sido derivados y que aún no recepciona
              </span>
            </div>
          </div>
        </div>
      </router-link>
    </el-col>
    <el-col :xs="24" :md="12" class="card-panel-col">
      <router-link :to="'/expedientes/enatencion'" class="link-type">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-expedientes icon-primary">
            <count-to
              :start-val="0"
              :end-val="datos.total_trabajadores"
              :duration="3500"
            />
          </div>
          <div class="descripction-expedientes">
            <div class="card-panel-text">
              <span class="title">Expedientes en atención</span>
              <br>
              <span class="description">
                Expedientes que usted ha recepcionado
              </span>
            </div>
          </div>
        </div>
      </router-link>
    </el-col>
    <el-col :xs="24" :md="12" class="card-panel-col">
      <router-link :to="'/expedientes/emitidos'" class="link-type">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-expedientes icon-primary">
            <count-to
              :start-val="0"
              :end-val="datos.total_expedientes"
              :duration="3500"
            />
          </div>
          <div class="descripction-expedientes">
            <div class="card-panel-text">
              <span class="title">Expedientes derivados</span>
              <br>
              <span class="description">
                Expedientes que usted ha derivado y que aún no han sido
                recepcionados
              </span>
            </div>
          </div>
        </div>
      </router-link>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { datosDashboard } from '@/api/search'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      datos: {
        total_usuarios: 0,
        total_expedientes: 0,
        total_areas: 0,
        total_trabajadores: 0
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    async fetchData() {
      await datosDashboard().then((response) => {
        // this.datos = response.data.items.slice(0, 8)
        this.datos = response
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  .card-panel-col {
    .card-panel {
      border-radius: 5px;
      border-top: 3px solid #1890ff;
    }
  }
}

.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }

      .icon-primary {
        background-color: #36a3f7;
      }

      // .icon-expedientes {
      // max-width: 125px;
      // background-color: orange;
      // color: #fff;
      // }

      // .total {
      //   background-color: orange;
      //   color: #fff;
      // }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .icon-primary {
      color: #36a3f7;
    }

    .icon-expedientes {
      width: 65px;
      float: left;
      font-size: 40px;
      font-weight: bold;

      .card-panel-icon {
        font-size: 30px;
      }

      .total {
        // background-color: rgb(27, 24, 24);
        color: rgba(0, 0, 0, 0.7);
        color: #36a3f7;
        font-size: 40px;
        font-weight: bold;
      }
    }

    .descripction-expedientes {
      padding-top: 20px;
      margin-left: 125px;
      .card-panel-text {
        padding-bottom: 15px;
        .title {
          color: rgba(0, 0, 0, 0.75);
          font-size: 16px;
          line-height: 18px;
          font-weight: bold;
        }

        .description {
          color: rgba(0, 0, 0, 0.55);
          font-size: 13px;
        }
      }

      .total {
        // background-color: rgb(27, 24, 24);
        color: rgba(0, 0, 0, 0.7);
        font-size: 30px;
        font-weight: bold;
      }
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      // background-color: teal;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
