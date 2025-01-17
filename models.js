const Sequelize = require('sequelize');


let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    define: {
      underscored: true
    }
  });
} else {
  sequelize = new Sequelize({
    database: 'characters_db',
    dialect: 'postgres',
    define: {
      underscored: true,
    },
  });
}

class User extends Sequelize.Model { };

User.init({
  username: Sequelize.STRING,
  password_digest: Sequelize.STRING
}, {
  sequelize,
  modelName: 'user'
});

class Game extends Sequelize.Model { };

Game.init({
  name: Sequelize.STRING,
  image_url: Sequelize.TEXT,
  description: Sequelize.TEXT,
}, {
  sequelize,
  modelName: 'game'
});

class Review extends Sequelize.Model { };

Review.init({
  review: Sequelize.TEXT(500)
}, {
  sequelize,
  modelName: 'review'
});

User.hasMany(Game, { onDelete: 'cascade' });
Game.belongsTo(User);

User.hasMany(Review, { onDelete: 'cascade' })
Review.belongsTo(User);

Game.hasMany(Review, { onDelete: 'cascade' })
Review.belongsTo(Game);

module.exports = {
  Game,
  User,
  Review,
  sequelize
}

