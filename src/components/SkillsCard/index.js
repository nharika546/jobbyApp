const SkillsCard=props=>{
    const {skillDetails}=props
    const {imageUrl,name}=skillDetails
    return(
        <li>
            <div>
                <img src={imageUrl}/>
                <p>{name}</p>
            </div>
        </li>
    ) 
}

export default SkillsCard