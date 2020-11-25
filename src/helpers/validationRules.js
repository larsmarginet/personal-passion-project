const nameRules = [
    v => v.length > 0 || 'Please enter a name',
    v => v.length < 25 || 'Your name can not be more than 25 characters' 
];

const imageRules =  [
    v => v != null || 'Please upload an image' ,
    v => !v || v.size < 2000000 || 'Image size should be less than 2 MB',
    v => !v || v.type === 'image/png' || v.type === 'image/jpeg' || 'Image has to be png or jpeg'
];

const emailRules =  [ 
    v => !!v || 'Email is required', 
    v => /.+@.+/.test(v) || 'E-mail must be valid' 
];

const passwordRules =  [ 
    v => !!v || 'Password is required', 
    v => (v && v.length >= 8) || 'Password must have 8+ characters',
    v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character', 
    v => /(?=.*\d)/.test(v) || 'Must have one number', 
    v => /([_.!@$%])/.test(v) || 'Must have one special character'  
];

const linkRules = [
    v => v ? /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(v) || 'Input must be a valid link' : true
];

const priceRules = [
    v => !!v || 'A price is required',
    v => v >= 0 || 'The price can not be less than 0',
];

const bubbleRules = [
    v => !!v || 'Please set the amount of bubbles',
    v => v >= 0 || 'The amount of bubbles can not be less than 0',
];

const categoryRules = [
    v => !!v || 'A category is required',
];

const descriptionRules = [
    v => !!v || 'A description is required',
    v => v.length <= 280 || 'Max 280 characters'
];

export {
    nameRules,
    imageRules,
    emailRules,
    passwordRules,
    linkRules,
    priceRules,
    bubbleRules,
    categoryRules,
    descriptionRules
}