<template>
  <div>
    <el-form ref="formCreateTienda" v-loading="loading" :model="modelo" :rules="reglas" label-position="top">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="CATEGORIA" prop="categoria_id">
            <el-select v-model="modelo.categoria_id" style="width: 100%">
              <el-option
                v-for="item in listaCategorias"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="RUC" prop="ruc">
            <el-input v-model="modelo.ruc" style="width: 100%" placeholder="RUC" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="RAZON SOCIAL" prop="razonsocial">
            <el-input v-model="modelo.razonsocial" style="width: 100%" placeholder="RAZON SOCIAL" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="LOGO" prop="logo">
            <img v-if="modelo.foto != null" :src="modelo.foto" alt="Icono de categoria" width="120px">
            <input type="file" accept="image/png, image/jpeg" @change="uploadImage($event)">
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="Ubicacion" prop="ubicacion">
            <el-row :gutter="10">
              <el-col :xs="24" :sm="12" :md="8">
                <label>Latitud</label>
                <el-input v-model="modelo.latitud" :readonly="true" />
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <label>Longitud</label>
                <el-input v-model="modelo.longitud" :readonly="true" />
              </el-col>
              <el-col :xs="24" :sm="24" :md="24">
                <p>Seleccione en el mapa para cargar la ubicacion del comercio</p>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div style="width: 100%; height: 350px;">
                  <mapbox-map
                    :access-token="'pk.eyJ1IjoicGVkcm9hcXMwNSIsImEiOiJja2ZpZ29iaWowZDVwMnBsM3M2MGxkaWQxIn0.DYp69EtGMZKWNDF6dzuzmQ'"
                    map-style="mapbox://styles/pedroaqs05/clbbd9lnp000314rzbv8mlzr6"
                    :center="mapCenter"
                    :zoom="14"
                    @click="selectPosition"
                  >
                    <mapbox-marker :lng-lat="[modelo.longitud,modelo.latitud]" color="#416165" />
                  </mapbox-map>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" justify="center">
        <el-button type="primary" plain @click="close">Cancelar</el-button>
        <el-button v-if="modelo.id <= 0 || modelo.id == undefined" type="primary" @click="submitForm">Guardar</el-button>
        <el-button v-if="modelo.id > 0" type="primary" @click="submitEditForm">Actualizar</el-button>
      </el-row>
    </el-form>
  </div>
</template>
<script>
// Resource
import CategoriasResource from '@/api/categorias'
const categoriasResource = new CategoriasResource()
import TiendaResource from '@/api/tienda'
const tiendaResource = new TiendaResource()
export default {
  name: 'CreateTienda',
  props: {
    tiendaid: {
      type: Number,
      default: () => {
        return -10
      }
    }
  },
  data() {
    var validarUbicacion = (rule, value, callback) => {
      if (this.modelo.latitud !== null || this.modelo.longitud !== null) {
        return callback()
      }
      return callback(new Error('Debe seleccionar la ubicacion dando click en el mapa.'))
    }
    return {
      loading: false,
      modelo: {
        id: undefined,
        ruc: null,
        razonsocial: null,
        logo: null,
        foto: null,
        latitud: null,
        longitud: null,
        categoria_id: null
      },
      reglas: {
        ruc: [{ required: true, message: 'El campo es obligatorio', trigger: 'blur' }],
        razonsocial: [{ required: true, message: 'El campo es obligatorio', trigger: 'blur' }],
        ubicacion: [{ validator: validarUbicacion, trigger: 'blur' }],
        categoria_id: [{ required: true, message: 'El campo es obligatorio', trigger: 'blur' }]
      },
      mapCenter: [-78.50252300459422, -7.165559127084376],
      listaCategorias: []
    }
  },
  watch: {
    tiendaid: function(newval, oldval) {
      this.modelo.id = this.tiendaid
      this.handleGetInitialData()
    }
  },
  mounted() {
    this.getListaCategorias()
    this.handleGetInitialData()
  },
  methods: {
    handleGetInitialData() {
      this.$nextTick(_ => {
        this.handleGetDataTienda()
        this.$refs['formCreateTienda'].clearValidate()
      })
    },
    getListaCategorias() {
      this.loading = true
      categoriasResource.listaCategoriasComercios()
        .then(
          (response) => {
            console.log(response)
            this.listaCategorias = response.data
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
    handleGetDataTienda() {
      this.loading = true
      if (this.modelo.id !== undefined && this.modelo.id > 0) {
        tiendaResource.get(this.modelo.id)
          .then((response) => {
            const { data } = response
            this.setDataTienda(data)
            this.loading = false
          })
          .catch(_ => {
            this.loading = false
            this.$message('No se ha obtenido datos de tienda')
          })
      }
    },
    uploadImage(event) {
      const file = event.target.files[0]
      this.modelo.logo = file
      this.modelo.foto = URL.createObjectURL(file)
    },
    selectPosition(e) {
      const { lngLat } = e
      this.modelo.latitud = lngLat.lat
      this.modelo.longitud = lngLat.lng
    },
    submitForm() {
      this.loading = true
      this.$refs['formCreateTienda'].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          formData.append('file', this.modelo.logo)
          formData.append('ruc', this.modelo.ruc)
          formData.append('razonsocial', this.modelo.razonsocial)
          formData.append('latitud', this.modelo.latitud)
          formData.append('longitud', this.modelo.longitud)
          formData.append('categoria_id', this.modelo.categoria_id)
          tiendaResource.store(formData)
            .then(
              (response) => {
                this.$message(response.message)
                this.close()
                this.loading = false
              }
            )
            .catch(
              (error) => {
                console.log(error)
                this.loading = false
              }
            )
        } else {
          this.loading = false
        }
      })
    },
    submitEditForm() {
      this.loading = true
      this.$refs['formCreateTienda'].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          formData.append('id', this.modelo.id)
          formData.append('file', this.modelo.logo)
          formData.append('ruc', this.modelo.ruc)
          formData.append('razonsocial', this.modelo.razonsocial)
          formData.append('latitud', this.modelo.latitud)
          formData.append('longitud', this.modelo.longitud)
          formData.append('categoria_id', this.modelo.categoria_id)
          tiendaResource.store(formData)
            .then(
              (response) => {
                this.$message(response.message)
                this.close()
                this.loading = false
              }
            )
            .catch(
              (error) => {
                console.log(error)
                this.loading = false
              }
            )
        } else {
          this.loading = false
        }
      })
    },
    close() {
      this.modelo = {
        ruc: null,
        razonsocial: null,
        logo: null,
        foto: null,
        latitud: null,
        longitud: null,
        categoria_id: null
      }
      this.mapCenter = [-78.50252300459422, -7.165559127084376]
      this.$emit('close')
    },
    setDataTienda(data) {
      this.modelo = {
        id: data.id,
        ruc: data.ruc,
        razonsocial: data.razonsocial,
        logo: data.logo,
        foto: null,
        latitud: data.latitud,
        longitud: data.longitud,
        categoria_id: data.categoria_id
      }
    }
  }
}
</script>
