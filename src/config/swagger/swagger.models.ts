import * as swagger from "swagger-express-ts";

export default {
  Example: {
    properties: {
          originalname: {
            type : swagger.SwaggerDefinitionConstant.Model.Property.Type.ARRAY ,
            required : true,
          },
          mimetype: {
            type : swagger.SwaggerDefinitionConstant.Model.Property.Type.STRING ,
            required : true,
          },
          filename : {
            type : swagger.SwaggerDefinitionConstant.Model.Property.Type.STRING ,
            required : true
          },
          path: {
            type : swagger.SwaggerDefinitionConstant.Model.Property.Type.STRING ,
            required : true
          },
          file: {
            type : swagger.SwaggerDefinitionConstant.Model.Property.Type.STRING ,
            required : true
          },
          size: {
            type : swagger.SwaggerDefinitionConstant.Model.Property.Type.STRING ,
            required : true
          },
          createAt: {
            type : swagger.SwaggerDefinitionConstant.Model.Property.Type.STRING ,
            required : true
          }
      }
  }
};
