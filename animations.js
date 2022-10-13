const card_divs = document.querySelectorAll('.card');

var classes = ['no-delay','one-delay','two-delay'];

const callback = (entries) => {
    entries.forEach(entry => {
        var card_id = parseInt(entry.target.id) % 3;
        if (entry.isIntersecting) {
            entry.target.classList.add('card-enter');
            entry.target.classList.add(classes[card_id]);
            /*
            if(card_id==0) {
                entry.target.classList.add('no-delay');
            } else if(card_id==1) {
                entry.target.classList.add('one-delay');
            } else if(card_id==2) {
                entry.target.classList.add('two-delay');
            }
            */
            return;
        }
        entry.target.classList.remove('card-enter');
        entry.target.classList.remove(classes[card_id]);
    });
};

card_divs.forEach(card => {
    card.classList.remove('card-enter');
    const observer = new IntersectionObserver(callback);
    observer.observe(card);
});
