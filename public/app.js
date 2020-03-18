class MoneyFormatter {
  constructor (moneyBlockClass) {
    this.moneyBlockClass = moneyBlockClass && 'j-price';
  }

  run() {

    Array.from(document.getElementsByClassName(this.moneyBlockClass)).forEach(node => {
      node.textContent = new Intl.NumberFormat('en-EN', {
        currency: 'USD',
        style: 'currency',
      }).format(node.textContent)
    });
  }
}

class CartTable {
  constructor(cartId) {
    this.cartId = cartId && 'cart';

    this.initRemoveListener()
  }

  initRemoveListener() {
    window.document.querySelectorAll('#' + this.cartId).forEach(element => {
      element.addEventListener('click', ({target}) => {
        if(target.className.indexOf('j-remove') < 0) {
          return;
        }

        const courseId = target.getAttribute('data-id');

        fetch('/cart/remove/' + courseId, {
          method: 'delete'
        })
          .then(res => res.json())
          .then(cart => {
            target.closest('#cart').querySelector('.j-price-total').textContent = new Intl.NumberFormat('en-EN', {
              currency: 'EUR',
              style: 'currency',
            }).format(cart.totalPrice);

            const $tr = target.closest('tr');
            const $count = $tr.querySelector('.j-count');

            if ($count.textContent === '1') {
              $tr.remove();
            } else {
              $count.textContent = Number($count.textContent) - 1;
            }
          })
      })
    });
  }
}

class App {
  constructor(){
    this.init();
  }

  init () {
    new MoneyFormatter('j-price').run();
    new CartTable('cart');
  }
}

new App();
