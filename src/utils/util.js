
//截取url
var SIGN_REGEXP = /([yMdhsm])(\1*)/g
export function getUrlKey(name, url) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null

}

//1.通过new File()将base64转换成file文件，此方式需考虑浏览器兼容问题。
//baser64转file
export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {
    type: mime
  })
}

//2.先将base64转换成blob，再将blob转换成file文件，此方法不存在浏览器不兼容问题。
//将base64转换为blob
export function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], {
    type: mime
  })
}
//将blob转换为file
export function blobToFile(theBlob, fileName) {
  theBlob.lastModifiedDate = new Date()
  theBlob.name = fileName
  return theBlob
}

export default {
  /**
   * 获取url中的参数
   * @param {*} name 参数名称
   */
  getQueryStringByName: function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    var context = ''
    if (r != null) context = r[2]
    reg = null
    r = null
    return context == null || context == '' || context == 'undefined' ?
      '' :
      context
  },


  formatDate: {
    /**
     * 时间戳型转日期
     * @param {*} date
     * @param {*} pattern yyyy-MM-dd
     * format(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss')
     */
    format: function (time, format) {
      var t = new Date(time)
      var tf = function (i) {
        return (i < 10 ? '0' : '') + i
      }
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear())
            break
          case 'MM':
            return tf(t.getMonth() + 1)
            break
          case 'mm':
            return tf(t.getMinutes())
            break
          case 'dd':
            return tf(t.getDate())
            break
          case 'HH':
            return tf(t.getHours())
            break
          case 'ss':
            return tf(t.getSeconds())
            break
        }
      })
    },
    /**
     * 时间戳型转日期
     * @param {*} dateString 时间戳
     * @param {*} pattern  格式yyyy-MM-dd
     */
    parse: function (dateString, pattern) {
      var matchs1 = pattern.match(SIGN_REGEXP)
      var matchs2 = dateString.match(/(\d)+/g)
      if (matchs1.length == matchs2.length) {
        var _date = new Date(1970, 0, 1)
        for (var i = 0; i < matchs1.length; i++) {
          var _int = parseInt(matchs2[i])
          var sign = matchs1[i]
          switch (sign.charAt(0)) {
            case 'y':
              _date.setFullYear(_int)
              break
            case 'M':
              _date.setMonth(_int - 1)
              break
            case 'd':
              _date.setDate(_int)
              break
            case 'h':
              _date.setHours(_int)
              break
            case 'm':
              _date.setMinutes(_int)
              break
            case 's':
              _date.setSeconds(_int)
              break
          }
        }
        return _date
      }
      return null
    }
  },

  // 根据现在时间获取时间串
  getNowFormatDate: function () {
    var date = new Date()
    var seperator1 = ''
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    var strHours = date.getHours()
    var strMinutes = date.getMinutes()
    var strSeconds = date.getSeconds()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    var currentdate =
      year +
      seperator1 +
      month +
      seperator1 +
      strDate +
      strHours +
      strMinutes +
      strSeconds
    return currentdate
  },
  /**
   * 数组转以逗号分开的字符串
   * @param {*} array 数组
   * @param {*} key key
   */
  ArrayToString: function (array, key) {
    var str = ''
    for (var i in array) {
      if (key != null) str += array[i][key].toString()
      else str += array[i].toString()
      if (i < array.length - 1) str += ','
    }
    return str
  },
  /**
   * 字符串转数组
   * @param {*} str 字符串
   */
  StringToArray: function (str) {
    if (str == null) {
      return []
    }
    var arr = str.split(',')
    return arr
  },
  romveTreeNode: function (data, id) {
    for (var i in data) {
      if (data[i].id === id) {
        // console.log("55555",data[i]);
        return data.splice(i, 1)
        // break
      } else {
        return this.romveTreeNode(data[i].children, id)
      }
    }
  },
  GetTreeIdKeys: function (data) {
    var ids = []
    for (var i in data) {
      if (data[i].checked) {
        ids.push(data[i].id)
      }
    }
    return ids
  },
  treeToList: function (data) {
    return data.reduce(
      (arr, {
        id,
        checked,
        children = []
      }) =>
      arr.concat([{
        id,
        checked
      }], this.treeToList(children)),
      []
    )
  }

}
