function getMembersNames(members) {
    let names = []
    members?.forEach((member) => {
        names.push(member.name)
    })
    return names.join(",")
}
export default getMembersNames