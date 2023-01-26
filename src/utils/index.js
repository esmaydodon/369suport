import { pluralize } from '@/filters'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][value ] }
    // return value.toString().padStart(2, '0')
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }

    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return 'Justo ahora'
  } else if (diff < 3600) {
    // less 1 hour
    return pluralize(Math.ceil(diff / 60), ' minuto') + '. atrás'
  } else if (diff < 3600 * 24) {
    return pluralize(Math.ceil(diff / 3600) + ' hora') + ' atrás'
  } else if (diff < 3600 * 24 * 2) {
    return '1 día atrás'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      pluralize(d.getMonth() + 1, ' mes') + ' ' +
      pluralize(d.getDate(), ' día') + ' ' +
      pluralize(d.getHours(), ' día') + ' ' +
      pluralize(d.getMinutes(), ' minuto')
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [
  {
    text: 'Ahora',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: 'Última sem.',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: 'último mes',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: 'Últimos 3 meses',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }
]

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // According to the last trigger interval
    const last = +new Date() - timestamp

    // The last time the wrapped function was called, the interval is last less than the set time interval wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // If it is set to immediate===true, since the start boundary has already been called, there is no need to call it here.
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // If the delay does not exist, reset the delay
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export const mesesOpciones = [
  {
    value: 1,
    label: 'Enero'
  },
  {
    value: 2,
    label: 'Febrero'
  },
  {
    value: 3,
    label: 'Marzo'
  },
  {
    value: 4,
    label: 'Abril'
  },
  {
    value: 5,
    label: 'Mayo'
  },
  {
    value: 6,
    label: 'Junio'
  },
  {
    value: 7,
    label: 'Julio'
  },
  {
    value: 8,
    label: 'Agosto'
  },
  {
    value: 9,
    label: 'Setiembre'
  },
  {
    value: 10,
    label: 'Octubre'
  },
  {
    value: 11,
    label: 'Noviembre'
  },
  {
    value: 12,
    label: 'Diciembre'
  }
]

export function getListYears() {
  const listYears = []
  const sumYears = (new Date()).getFullYear() - 2021 + 1
  for (let i = 2021; i <= 2021 + sumYears; i++) {
    this.listYears.push(
      {
        value: i,
        label: i
      }
    )
  }
  return listYears
}

/**
 * Remove class from element
 * return today
 */
export function getToday() {
  let today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()

  today = yyyy + '-' + mm + '-' + dd
  return today
}

/**
 * Remove class from element
 * return today
 */
export function getTodayHour() {
  let today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()

  today = yyyy + '-' + mm + '-' + dd + ' 00:00:10'
  return today
}

/**
 * Remove class from element
 * return today
 */
export function getFirstDayMoth() {
  let today = new Date()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  today = yyyy + '-' + mm + '-01'
  return today
}

/**
 * Remove class from element
 * return today
 */
export function getFirstDayMothHour() {
  let today = new Date()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  today = yyyy + '-' + mm + '-01 01:00:00'
  return today
}

/**
 * Get first day of year
 * return today
 */
export function getFirstDayYear() {
  let today = new Date()
  const yyyy = today.getFullYear()
  today = yyyy + '-01-01 01:00:00'
  return today
}

/**
 * Get lista Anios sistema
 * return array
 */
export function getListAniosSistemas() {
  const listaAnios = []
  const anioInicioSistema = 2022
  const sumarAnios = new Date().getFullYear() - anioInicioSistema + 1
  for (let i = anioInicioSistema; i <= anioInicioSistema + sumarAnios; i++) {
    listaAnios.push({ id: i, descripcion: i })
  }
  return listaAnios
}

/**
 * Get lista meses
 * return array
 */
export function getListMeses() {
  const mesesList = [
    { id: 1, descripcion: 'Enero' },
    { id: 2, descripcion: 'Febrero' },
    { id: 3, descripcion: 'Marzo' },
    { id: 4, descripcion: 'Abril' },
    { id: 5, descripcion: 'Mayo' },
    { id: 6, descripcion: 'Junio' },
    { id: 7, descripcion: 'Julio' },
    { id: 8, descripcion: 'Agosto' },
    { id: 9, descripcion: 'Setiembre' },
    { id: 10, descripcion: 'Octubre' },
    { id: 11, descripcion: 'Noviembre' },
    { id: 12, descripcion: 'Diciembre' }
  ]
  return mesesList
}
