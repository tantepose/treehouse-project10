'use strict';
module.exports = (sequelize, DataTypes) => {
  var loans = sequelize.define('loans', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: DataTypes.DATE
  }, {
    timestamps: false,
    freezeTableName: true,
    underscored: true
  });

  // associating loans with books and patrons (couldn't do this without aliases (as))
  loans.associate = function(models) {
    loans.belongsTo(models.books, {
      as: 'book',
      foreignKey: 'book_id'
    });
  
    loans.belongsTo(models.patrons, {
      as: 'patron',
      foreignKey: 'patron_id'
    });
  };

  return loans;
};
  
