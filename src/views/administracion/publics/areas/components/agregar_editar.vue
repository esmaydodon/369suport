<template>
  <div>
    <div v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form ref="aformArea" :model="area" :rules="reglas" label-position="top">
            <el-form-item label="Nombre" prop="nombre">
              <el-input v-model="area.nombre" @keyup.native="area.nombre = upperModel(area.nombre)" />
            </el-form-item>
            <el-form-item label="Abreviatura" prop="abreviatura">
              <el-input v-model="area.abreviatura" @keyup.native="area.abreviatura = upperModel(area.abreviatura)" />
            </el-form-item>
            <el-form-item label="'Area" prop="area_padre_id">
              <!-- <el-input v-model="area.area_padre_id" /> -->
              <el-select
                v-show="showSelectArea"
                ref="refareaId"
                v-model="area.areaId"
                filterable
                clearable
                reserve-keyword
                placeholder="Ingrese un área..."
                :loading="loadingSelectArea"
                style="width: 100%"
                @change="getAreaPadre"
              >
                <el-option
                  v-for="item in selectAreas"
                  :key="item.id"
                  :label="item.nombre"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Servicio" prop="servicio">
              <el-switch v-model="area.servicio" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row :gutter="10" :type="rowType" justify="center">
        <el-col :xs="24" :sm="12" :md="8" style="text-align: right;">
          <el-button type="primary" plain style="width: 100%; margin: 7px 0px;" @click="close">Cancelar</el-button>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" style="text-align: left;">
          <el-button type="primary" style="width: 100%; margin: 7px 0px;" @click="handleSubmitForm">Guardar</el-button>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
// Utilidades
import { debounce } from '@/utils'
// Resource
// import areasResource from '@/api/camas'
// const areasResource = new areasResource()
import AreasResource from '@/api/areas'
const areasResource = new AreasResource()

export default {
  name: 'AgregarEditarArea',
  props: {
    areaId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      area: {
        id: undefined,
        servicio: null,
        area_padre_id: null,
        abreviatura: '',
        nombre: ''
      },
      loadingSelectArea: false,
      selectAreas: [],
      showSelectArea: true,
      listAreas: [],
      reglas: {
        nombre: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' }
          // ,{ require: true, max: 20, message: 'El campo debe tener máximo 20 caracteres.', trigger:areaId 'blur' }
        ],
        abreviatura: [
          { required: true, message: 'El campo es obligatorio.', trigger: 'blur' }
          // ,{ require: true, max: 20, message: 'El campo debe tener máximo 20 caracteres.', trigger: 'blur' }
        ]
      },
      rowType: 'flex'
    }
  },
  watch: {
    areaId(newValue, oldValue) {
      if (newValue > 0) {
        this.getArea()
        this.getAreaPadre()
      }

      this.getAreaPadre()
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      const windowWidth = document.documentElement.clientWidth
      if (windowWidth < 768) {
        this.rowType = ''
      } else {
        this.rowType = 'flex'
      }
    })

    window.addEventListener('resize', this.__resizeHandler)
    if (this.areaId > 0) {
      this.getArea()
    }
    this.getAreaPadre()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    upperModel(value) {
      return value.toUpperCase()
    },
    getArea() {
      this.loading = true
      areasResource.get(this.areaId)
        .then(
          (response) => {
            this.area = response.data
            this.loading = false
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },
    async getAreaPadre() {
      await areasResource
        .cargarComboArea({})
        .then((response) => {
          this.selectAreas = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handleSubmitForm() {
      this.$refs['aformArea'].validate((valid) => {
        if (valid) {
          if (this.areaId < 0) {
            this.agregarArea()
          } else {
            this.editarArea()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    agregarArea() {
      this.loading = true
      areasResource.store(this.area)
        .then(
          (response) => {
            this.$message({
              type: 'success',
              message: response.message
            })
            this.loading = false
            this.close()
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },
    editarArea() {
      this.loading = true
      areasResource.update(this.areaId, this.area)
        .then(
          (response) => {
            this.$message({
              type: 'success',
              message: response.message
            })
            this.loading = false
            this.close()
          }
        )
        .catch(
          (error) => {
            console.log(error)
            this.loading = false
          }
        )
    },
    // remoteMethod(query) {
    //   if (query !== '') {
    //     this.loadingSelectArea = true
    //     setTimeout(() => {
    //       this.loadingSelectArea = false
    //       this.selectAreas = this.listAreas.filter((item) => {
    //         return item.nombre.toUpperCase().indexOf(query.toUpperCase()) > -1
    //       })
    //     }, 200)
    //   } else {
    //     this.selectAreas = []
    //   }
    // },
    close() {
      this.area = {
        id: undefined,
        abreviatura: '',
        servicio: null,
        area_padre_id: null,
        nombre: ''
      }
      this.$refs['aformArea'].resetFields()
      this.$emit('close')
    }
  }
}

</script>
