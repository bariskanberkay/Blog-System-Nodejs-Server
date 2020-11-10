const {DataTypes} = require('sequelize');

module.exports = model;

function model(sequelize){

    const attrs = {
        email:{type:DataTypes.STRING,allowNull:false},
        username:{type:DataTypes.STRING,allowNull:false},
        password:{type:DataTypes.STRING,allowNull:false},
        firstName:{type:DataTypes.STRING,allowNull:true},
        lastName:{type:DataTypes.STRING,allowNull:true},
        role:{type:DataTypes.STRING,allowNull:false},
        verificationToken:{type:DataTypes.STRING},
        verified:{type:DataTypes.DATE},
        resetToken:{type:DataTypes.STRING},
        resetTokenExpires:{type:DataTypes.DATE},
        passwordReset:{type:DataTypes.DATE},
        created:{type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW},
        updated:{type:DataTypes.DATE},
        isVerified:{
            type:DataTypes.VIRTUAL,
            get(){
                return !!(this.verified || this.passwordReset);
            }
        }
    }

    const options = {
        timestamps : false,
        defaultScope:{
            attributes:{
                exclude:['password']
            }
        },
        scopes:{
            withHash:{
                attributes:{}
            }
        }
    }

    return sequelize.define('user',attrs,options);

    
}