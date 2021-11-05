export const getNextDays = (date) => {
    let finalDay = date + 6;
    let Days = []
    let num
    for (num = date; num <= finalDay; num++) {
        if ((num == 1) || (num - 7) == 1) 
            Days.push('Monday')
         else if ((num == 2) || (num - 7) == 2) {
            Days.push('Tuesday')
        } else if ((num == 3) || (num - 7) == 3) {
            Days.push('Wednesday')
        } else if ((num == 4) || (num - 7) == 4) {
            Days.push('Thursday')
        } else if ((num == 5) || (num - 7) == 5) {
            Days.push('Friday')
        } else if ((num == 6) || (num - 7) == 6) {
            Days.push('Saturday')
        } else if ((num == 7) || (num - 7) == 7) {
            Days.push('Sunday')
        } else {
            Days.push('Invalid day')
        }
    }
    Days[0] = 'Today'
    return Days
}
