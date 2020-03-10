class MoneyFormatter {
  constructor (moneyBlockClass) {
    this.moneyBlockClass = moneyBlockClass && 'j-price';
  }

  run() {

    Array.from(document.getElementsByClassName(this.moneyBlockClass)).forEach(node => {
      console.log(node)
      node.textContent = new Intl.NumberFormat('en-EN', {
        currency: 'USD',
        style: 'currency',
      }).format(node.textContent)
    });
  }
}

class CardTable {
  constructor(cardId) {
    this.cardId = cardId && 'card';

    this.initRemoveListener()
  }

  initRemoveListener() {
    window.document.querySelectorAll('#' + this.cardId).forEach(element => {
      element.addEventListener('click', ({target}) => {
        if(target.className.indexOf('j-remove') < 0) {
          return;
        }

        const courseId = target.getAttribute('data-id');

        fetch('/card/remove/' + courseId, {
          method: 'delete'
        })
          .then(res => res.json())
          .then(card => {
            target.closest('#card').querySelector('.j-price-total').textContent = new Intl.NumberFormat('en-EN', {
              currency: 'EUR',
              style: 'currency',
            }).format(card.price);

            const $tr = target.closest('tr')
            const $count = $tr.querySelector('.j-count')

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
    new CardTable('card');
  }
}

new App();
