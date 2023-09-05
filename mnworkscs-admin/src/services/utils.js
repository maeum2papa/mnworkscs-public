export const sortDown = (sortId, lists) => {
    const newLists = [...lists]
    let temp = []

    let target = newLists.find(ele => ele.idx === sortId); //클릭한 객체값
    
    for(let i = 0; i < newLists.length; i++) {
        if (target.sort > newLists[i].sort) {
            temp.push(newLists[i].sort)
        }
    } 
    
    if(temp.length > 0) {
        const changeSort = Math.max(...temp)
        const changeTarget = newLists.find(ele => ele.sort === changeSort) //변경될 객체 값
        
        let tempSort = changeTarget.sort
        changeTarget.sort = target.sort
        target.sort = tempSort
        
        newLists.sort((a, b) => b.sort - a.sort); 
        return newLists
    }
}

export const sortUp = (sortId, lists) => {
    const newLists = [...lists]
    let temp = []

    let target = newLists.find(ele => ele.idx === sortId); //클릭한 객체값
    
    for(let i = 0; i < newLists.length; i++) {
        if (target.sort < newLists[i].sort) {
            temp.push(newLists[i].sort)
        }
    } 
    
    if(temp.length > 0) {
        const changeSort = Math.min(...temp)
        const changeTarget = newLists.find(ele => ele.sort === changeSort) //변경될 객체 값
        
        let tempSort = changeTarget.sort
        changeTarget.sort = target.sort
        target.sort = tempSort
        
        newLists.sort((a, b) => b.sort - a.sort); 
        return newLists
    }
}