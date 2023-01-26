/**
 * database64文件格式转换为2进制
 *
 * @param  {[String]} data dataURL el formato es “data:image/png;base64,****”,Antes de la coma hay un texto descriptivo, solo necesitamos el texto después de la coma.
 * @param  {[String]} mime [description]
 * @return {[blob]}      [description]
 */
export default function(data, mime) {
  data = data.split(',')[1]
  data = window.atob(data)
  var ia = new Uint8Array(data.length)
  for (var i = 0; i < data.length; i++) {
    ia[i] = data.charCodeAt(i)
  }
  // canvas.toDataURL El formato predeterminado devuelto es image/png
  return new Blob([ia], {
    type: mime
  })
}
