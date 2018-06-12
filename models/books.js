'use strict';
module.exports = (sequelize, DataTypes) => {
  var books = sequelize.define('books', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    first_published: DataTypes.INTEGER
  }, {
    timestamps: false,
    freezeTableName: true,
    underscored: true
  });
  books.associate = function(models) {
    // associate books with loans
    books.hasOne(models.loans);
  };
  return books;
};