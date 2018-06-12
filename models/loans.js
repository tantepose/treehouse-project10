'use strict';
module.exports = (sequelize, DataTypes) => {
  var loans = sequelize.define('loans', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: DataTypes.DATE
  }, {
    timestamps: false
  });

  loans.associate = function(models) {
    // associating loans with books and patrons
    loans.belongsTo(models.books, {foreignKey: 'book_id'});
    loans.belongsTo(models.patrons, {foreignKey: 'patron_id'});
  };

  return loans;
};