const { Genre } = require("./routes/genres");
const { Movie } = require("./routes/movies");
const mongoose = require("mongoose");
const config = require("config");

const data = [
  {
    name: "Comedy",
    movies: [
      { title: "Airplane", numberInStock: 120, dailyRentalRate: 2 },
      { title: "The Hangover", numberInStock: 100, dailyRentalRate: 2 },
      { title: "Wedding Crashers", numberInStock: 150, dailyRentalRate: 2 }
    ]
  },
  {
    name: "Action",
    movies: [
      { title: "Die Hard", numberInStock: 50, dailyRentalRate: 2 },
      { title: "Terminator", numberInStock: 100, dailyRentalRate: 2 },
      { title: "The Avengers", numberInStock: 150, dailyRentalRate: 2 }
    ]
  },
  {
    name: "Romance",
    movies: [
      { title: "The Notebook", numberInStock: 50, dailyRentalRate: 2 },
      { title: "When Harry Met Sally", numberInStock: 100, dailyRentalRate: 2 },
      { title: "Pretty Woman", numberInStock: 150, dailyRentalRate: 2 }
    ]
  },
  {
    name: "Thriller",
    movies: [
      { title: "The Sixth Sense", numberInStock: 50, dailyRentalRate: 2 },
      { title: "Gone Girl", numberInStock: 100, dailyRentalRate: 2 },
      { title: "The Others", numberInStock: 150, dailyRentalRate: 2 }
    ]
  }
];

async function seed() {
  const db = config.get('db')
  mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log(`Connection to ${db} with success`)).catch(err => console.error(err))

  await Movie.deleteMany({});
  await Genre.deleteMany({});

  for (let genre of data) {
    const { _id: genreId } = await new Genre({ name: genre.name }).save();
    const movies = genre.movies.map(movie => ({
      ...movie,
      genre: { _id: genreId, name: genre.name }
    }));
    await Movie.insertMany(movies);
  }

  mongoose.disconnect();

  console.info("Done!");
}

seed();
