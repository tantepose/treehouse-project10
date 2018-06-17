'use strict';
module.exports = (sequelize, DataTypes) => {
  var books = sequelize.define('books', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Title required!"
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Author required!"
        }
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Genre required!"
        }
      }
    },
    first_published: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "First published required!"
        }
      }
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    underscored: true
  });

  // associate books with loans
  books.associate = function(models) {
    books.hasOne(models.loans);
  };
  return books;
};