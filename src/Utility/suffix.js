export const suffix=(num)=>{
    
    if((num%10)==0){
       return 'th'
    }
    else if(num%10==1){
        return 'st'
    }
    else if(num%10==2){
        return 'nd'
    }
    else
       return 'th'
    
}