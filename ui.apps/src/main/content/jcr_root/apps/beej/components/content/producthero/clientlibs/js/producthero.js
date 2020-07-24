var patagoniaNanoData = {
    title: 'Patagonia Nano Jacket',
    description: 'Here is a really puffy and warm jacket, made from synthetic materials to keep you warm and save the planet',
    buttonText: 'Add to Cart',
    price: '$99.00'
}
var productComp = Vue.component('productcmp', {
    template: '#product-template',
    props: {
        title: {
            type: String
        },
        description: {
            type: String
        },
        buttonColor: {
            type: String
        },
        buttonText: {
            type: String
        }
    }
});
/**
* Vue App definition
*/
var vueApp = new Vue({
   el: '#productApp',
   data: patagoniaNanoData,
   components: {
       productComp: productComp
   }
});