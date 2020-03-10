import {Router} from 'express';
import Card from "../models/card";
import Course from "../models/course";

const router = Router();

router.get('/', async (req, res) => {
  const card = await Card.fetch();

  res.render('card', {
    title: 'Card',
    isCard: true,
    price: card.price,
    courses: card.courses,
  })
});

router.delete('/remove/:id', async (req, res) => {
  const card = await Card.remove(req.params.id)

  res.status(200).json(card);
})

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id);

  await Card.add(course);
  res.redirect('/courses');
});

module.exports = router;

