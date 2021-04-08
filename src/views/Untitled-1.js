let proxyArr = new Proxy([],{
    set:function(arr,index,val){
        arr[index] = val + 1
    }
})

proxyArr[1] = 999

console.log(proxyArr);