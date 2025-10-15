const Joi=require("joi");

const listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string()
            .required(),
        description:Joi.string()
            .required(),
        location:Joi.string()
            .required(),
        country:Joi.string()
            .required(),
        price:Joi.number()
            .required()
            .min(0),
        image:Joi.string()
            .allow("",null),
            iconType: Joi.string()
      .valid(
        "Iconic cities",
        "Mountains",
        "Castle",
        "Amazing pools",
        "Camping",
        "Desert",
        "Beach",
        "Lake",
        "Dome",
        "Farms",
        "Nightlife",
        "Rooms"
      )
      .required(),    
    }).required(),
});

const reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().min(1).max(5)
           .required()
            .messages({
                "any.required": "Rating is required",
                "number.base": "Rating must be a number",
                "number.min": "Rating must be at least 1",
                "number.max": "Rating cannot be more than 5"  
                  }),        
        comment:Joi.string()
            .trim()      // removes spaces
            .min(1)      // ensures not empty
            .required()
            .messages({
                "string.empty": "Comment cannot be empty",
                "any.required": "Comment is required"
            }),
    }).required(),
});


module.exports = { listingSchema, reviewSchema };
