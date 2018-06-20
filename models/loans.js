'use strict';
module.exports = (sequelize, DataTypes) => {
  var loans = sequelize.define('loans', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Book ID required!'
        },
        isInt: {
          msg: 'Book ID must be an integer!'
        }
      }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Patron ID required!'
        },
        isInt: {
          msg: 'Patron ID must be an integer!'
        }
      }
    },
    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: 'Loaned on required!'
        },
        isDate: {
          msg: 'Loaned on must be a valid date! (eg. 2018-05-29)'
        }
      }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: 'Return by required!'
        },
        isDate: {
          msg: 'Return by must be a valid date! (eg. 2018-05-29)'
        }
      }
    },
    returned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: 'Returned on required!'
        },
        isDate: {
          msg: 'Returned on must be a valid date! (eg. 2018-05-29)'
        }
      }
    }
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
  
