(window.webpackJsonp=window.webpackJsonp||[]).push([[162],{857:function(s,n,a){"use strict";a.r(n);var t=a(2),e=Object(t.a)({},(function(){var s=this,n=s._self._c;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("h1",{attrs:{id:"string类型"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#string类型"}},[s._v("🌙")]),s._v(" String类型")]),s._v(" "),n("blockquote",[n("p",[s._v("https://redis.io/docs/data-types/strings/")])]),s._v(" "),n("p",[s._v("String类型，即字符串类型，是Redis中最简单的存储类型。")]),s._v(" "),n("p",[s._v("其value是字符串，不过根据字符串的格式不同，又可以分为3类：")]),s._v(" "),n("ul",[n("li",[n("code",[s._v("string")]),s._v(": 普通字符串")]),s._v(" "),n("li",[n("code",[s._v("int")]),s._v(": 整数类型，可以做自增、自减操作")]),s._v(" "),n("li",[n("code",[s._v("float")]),s._v(": 浮点类型，可以做自增、自减操作")])]),s._v(" "),n("table",[n("thead",[n("tr",[n("th",[s._v("KEY")]),s._v(" "),n("th",[s._v("VALUE")])])]),s._v(" "),n("tbody",[n("tr",[n("td",[s._v("msg")]),s._v(" "),n("td",[s._v("hello redis")])]),s._v(" "),n("tr",[n("td",[s._v("num")]),s._v(" "),n("td",[s._v("10")])]),s._v(" "),n("tr",[n("td",[s._v("score")]),s._v(" "),n("td",[s._v("99.5")])])])]),s._v(" "),n("p",[s._v("String 常见命令有：")]),s._v(" "),n("ul",[n("li",[n("code",[s._v("SET")]),s._v(": 添加或者修改已经存在的一个string的键值对")]),s._v(" "),n("li",[n("code",[s._v("GET")]),s._v(": 根据key获取String类型的value")]),s._v(" "),n("li",[n("code",[s._v("MSET")]),s._v(": 批量添加多个String类型的value")]),s._v(" "),n("li",[n("code",[s._v("MGET")]),s._v(": 根据多个key获取多个String类型的value")]),s._v(" "),n("li",[n("code",[s._v("INCR")]),s._v(": 让一个整型的key自增1")]),s._v(" "),n("li",[n("code",[s._v("INCRBY")]),s._v(": 让一个整型的key自增并制定步长，例如："),n("code",[s._v("incrby num 2")]),s._v(" 让num值自增2")]),s._v(" "),n("li",[n("code",[s._v("INCRBYFLOAT")]),s._v(": 让一个浮点型的数字自增并指定步长")]),s._v(" "),n("li",[n("code",[s._v("SETNX")]),s._v(": 添加一个string类型的键值对，前提是这个key不存在，否则不执行")]),s._v(" "),n("li",[n("code",[s._v("SETEX")]),s._v(": 添加一个string类型的键值对，并制定有效期")])]),s._v(" "),n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[n("span",{pre:!0,attrs:{class:"token number"}},[s._v("127.0")]),s._v(".0.1:637"),n("span",{pre:!0,attrs:{class:"token operator"}},[n("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("9")]),s._v(">")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("set")]),s._v(" name jeek\n"),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("127.0")]),s._v(".0.1:637"),n("span",{pre:!0,attrs:{class:"token operator"}},[n("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("9")]),s._v(">")]),s._v(" get name\n"),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"jeek"')]),s._v("\n\n"),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("127.0")]),s._v(".0.1:637"),n("span",{pre:!0,attrs:{class:"token operator"}},[n("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("9")]),s._v(">")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("help")]),s._v(" @STRING\n\n  APPEND key value\n  summary: Append a value to a key\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.0")]),s._v(".0\n\n  BITCOUNT key "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("start end"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n  summary: Count "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("set")]),s._v(" bits "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v(" a string\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.6")]),s._v(".0\n\n  BITFIELD key "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("GET "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("type")]),s._v(" offset"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("SET "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("type")]),s._v(" offset value"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("INCRBY "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("type")]),s._v(" offset increment"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("OVERFLOW WRAP"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("SAT"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("FAIL"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n  summary: Perform arbitrary bitfield integer operations on strings\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("3.2")]),s._v(".0\n\n  BITOP operation destkey key "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("key "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v("."),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n  summary: Perform bitwise operations between strings\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.6")]),s._v(".0\n\n  BITPOS key bit "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("start"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("end"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n  summary: Find first bit "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("set")]),s._v(" or "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("clear")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v(" a string\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.8")]),s._v(".7\n\n  DECR key\n  summary: Decrement the integer value of a key by one\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.0")]),s._v(".0\n\n  DECRBY key decrement\n  summary: Decrement the integer value of a key by the given number\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.0")]),s._v(".0\n\n  GET key\n  summary: Get the value of a key\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.0")]),s._v(".0\n\n  GETBIT key offset\n  summary: Returns the bit value at offset "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v(" the string value stored at key\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.2")]),s._v(".0\n\n  GETRANGE key start end\n  summary: Get a substring of the string stored at a key\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.4")]),s._v(".0\n\n  GETSET key value\n  summary: Set the string value of a key and "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("return")]),s._v(" its old value\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.0")]),s._v(".0\n\n  INCR key\n  summary: Increment the integer value of a key by one\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.0")]),s._v(".0\n\n  INCRBY key increment\n  summary: Increment the integer value of a key by the given amount\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.0")]),s._v(".0\n\n  INCRBYFLOAT key increment\n  summary: Increment the float value of a key by the given amount\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.6")]),s._v(".0\n\n  MGET key "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("key "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v("."),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n  summary: Get the values of all the given keys\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.0")]),s._v(".0\n\n  MSET key value "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("key value "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v("."),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n  summary: Set multiple keys to multiple values\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.0")]),s._v(".1\n\n  MSETNX key value "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("key value "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v("."),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n  summary: Set multiple keys to multiple values, only "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" none of the keys exist\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.0")]),s._v(".1\n\n  PSETEX key milliseconds value\n  summary: Set the value and expiration "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v(" milliseconds of a key\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.6")]),s._v(".0\n\n  SET key value "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("expiration EX seconds"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("PX milliseconds"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("NX"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("XX"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n  summary: Set the string value of a key\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.0")]),s._v(".0\n\n  SETBIT key offset value\n  summary: Sets or clears the bit at offset "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v(" the string value stored at key\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.2")]),s._v(".0\n\n  SETEX key seconds value\n  summary: Set the value and expiration of a key\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.0")]),s._v(".0\n\n  SETNX key value\n  summary: Set the value of a key, only "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" the key does not exist\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1.0")]),s._v(".0\n\n  SETRANGE key offset value\n  summary: Overwrite part of a string at key starting at the specified offset\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.2")]),s._v(".0\n\n  STRLEN key\n  summary: Get the length of the value stored "),n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("in")]),s._v(" a key\n  since: "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.2")]),s._v(".0\n\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br"),n("span",{staticClass:"line-number"},[s._v("14")]),n("br"),n("span",{staticClass:"line-number"},[s._v("15")]),n("br"),n("span",{staticClass:"line-number"},[s._v("16")]),n("br"),n("span",{staticClass:"line-number"},[s._v("17")]),n("br"),n("span",{staticClass:"line-number"},[s._v("18")]),n("br"),n("span",{staticClass:"line-number"},[s._v("19")]),n("br"),n("span",{staticClass:"line-number"},[s._v("20")]),n("br"),n("span",{staticClass:"line-number"},[s._v("21")]),n("br"),n("span",{staticClass:"line-number"},[s._v("22")]),n("br"),n("span",{staticClass:"line-number"},[s._v("23")]),n("br"),n("span",{staticClass:"line-number"},[s._v("24")]),n("br"),n("span",{staticClass:"line-number"},[s._v("25")]),n("br"),n("span",{staticClass:"line-number"},[s._v("26")]),n("br"),n("span",{staticClass:"line-number"},[s._v("27")]),n("br"),n("span",{staticClass:"line-number"},[s._v("28")]),n("br"),n("span",{staticClass:"line-number"},[s._v("29")]),n("br"),n("span",{staticClass:"line-number"},[s._v("30")]),n("br"),n("span",{staticClass:"line-number"},[s._v("31")]),n("br"),n("span",{staticClass:"line-number"},[s._v("32")]),n("br"),n("span",{staticClass:"line-number"},[s._v("33")]),n("br"),n("span",{staticClass:"line-number"},[s._v("34")]),n("br"),n("span",{staticClass:"line-number"},[s._v("35")]),n("br"),n("span",{staticClass:"line-number"},[s._v("36")]),n("br"),n("span",{staticClass:"line-number"},[s._v("37")]),n("br"),n("span",{staticClass:"line-number"},[s._v("38")]),n("br"),n("span",{staticClass:"line-number"},[s._v("39")]),n("br"),n("span",{staticClass:"line-number"},[s._v("40")]),n("br"),n("span",{staticClass:"line-number"},[s._v("41")]),n("br"),n("span",{staticClass:"line-number"},[s._v("42")]),n("br"),n("span",{staticClass:"line-number"},[s._v("43")]),n("br"),n("span",{staticClass:"line-number"},[s._v("44")]),n("br"),n("span",{staticClass:"line-number"},[s._v("45")]),n("br"),n("span",{staticClass:"line-number"},[s._v("46")]),n("br"),n("span",{staticClass:"line-number"},[s._v("47")]),n("br"),n("span",{staticClass:"line-number"},[s._v("48")]),n("br"),n("span",{staticClass:"line-number"},[s._v("49")]),n("br"),n("span",{staticClass:"line-number"},[s._v("50")]),n("br"),n("span",{staticClass:"line-number"},[s._v("51")]),n("br"),n("span",{staticClass:"line-number"},[s._v("52")]),n("br"),n("span",{staticClass:"line-number"},[s._v("53")]),n("br"),n("span",{staticClass:"line-number"},[s._v("54")]),n("br"),n("span",{staticClass:"line-number"},[s._v("55")]),n("br"),n("span",{staticClass:"line-number"},[s._v("56")]),n("br"),n("span",{staticClass:"line-number"},[s._v("57")]),n("br"),n("span",{staticClass:"line-number"},[s._v("58")]),n("br"),n("span",{staticClass:"line-number"},[s._v("59")]),n("br"),n("span",{staticClass:"line-number"},[s._v("60")]),n("br"),n("span",{staticClass:"line-number"},[s._v("61")]),n("br"),n("span",{staticClass:"line-number"},[s._v("62")]),n("br"),n("span",{staticClass:"line-number"},[s._v("63")]),n("br"),n("span",{staticClass:"line-number"},[s._v("64")]),n("br"),n("span",{staticClass:"line-number"},[s._v("65")]),n("br"),n("span",{staticClass:"line-number"},[s._v("66")]),n("br"),n("span",{staticClass:"line-number"},[s._v("67")]),n("br"),n("span",{staticClass:"line-number"},[s._v("68")]),n("br"),n("span",{staticClass:"line-number"},[s._v("69")]),n("br"),n("span",{staticClass:"line-number"},[s._v("70")]),n("br"),n("span",{staticClass:"line-number"},[s._v("71")]),n("br"),n("span",{staticClass:"line-number"},[s._v("72")]),n("br"),n("span",{staticClass:"line-number"},[s._v("73")]),n("br"),n("span",{staticClass:"line-number"},[s._v("74")]),n("br"),n("span",{staticClass:"line-number"},[s._v("75")]),n("br"),n("span",{staticClass:"line-number"},[s._v("76")]),n("br"),n("span",{staticClass:"line-number"},[s._v("77")]),n("br"),n("span",{staticClass:"line-number"},[s._v("78")]),n("br"),n("span",{staticClass:"line-number"},[s._v("79")]),n("br"),n("span",{staticClass:"line-number"},[s._v("80")]),n("br"),n("span",{staticClass:"line-number"},[s._v("81")]),n("br"),n("span",{staticClass:"line-number"},[s._v("82")]),n("br"),n("span",{staticClass:"line-number"},[s._v("83")]),n("br"),n("span",{staticClass:"line-number"},[s._v("84")]),n("br"),n("span",{staticClass:"line-number"},[s._v("85")]),n("br"),n("span",{staticClass:"line-number"},[s._v("86")]),n("br"),n("span",{staticClass:"line-number"},[s._v("87")]),n("br"),n("span",{staticClass:"line-number"},[s._v("88")]),n("br"),n("span",{staticClass:"line-number"},[s._v("89")]),n("br"),n("span",{staticClass:"line-number"},[s._v("90")]),n("br"),n("span",{staticClass:"line-number"},[s._v("91")]),n("br"),n("span",{staticClass:"line-number"},[s._v("92")]),n("br"),n("span",{staticClass:"line-number"},[s._v("93")]),n("br"),n("span",{staticClass:"line-number"},[s._v("94")]),n("br"),n("span",{staticClass:"line-number"},[s._v("95")]),n("br"),n("span",{staticClass:"line-number"},[s._v("96")]),n("br"),n("span",{staticClass:"line-number"},[s._v("97")]),n("br"),n("span",{staticClass:"line-number"},[s._v("98")]),n("br"),n("span",{staticClass:"line-number"},[s._v("99")]),n("br"),n("span",{staticClass:"line-number"},[s._v("100")]),n("br"),n("span",{staticClass:"line-number"},[s._v("101")]),n("br"),n("span",{staticClass:"line-number"},[s._v("102")]),n("br")])])])}),[],!1,null,null,null);n.default=e.exports}}]);