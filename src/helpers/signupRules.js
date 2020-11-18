const nameRules = [
    v => v.length > 0 || 'Please enter a name',
    v => v.length < 25 || 'Your name can not be more than 25 characters' 
];

const logoRules =  [
    v => v != null || 'Please upload a logo' ,
    v => !v || v.size < 2000000 || 'Logo size should be less than 2 MB',
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
]

export {
    nameRules,
    logoRules,
    emailRules,
    passwordRules,
    linkRules
}