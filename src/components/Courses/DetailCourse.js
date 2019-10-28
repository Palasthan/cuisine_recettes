import React, {useEffect, useState} from "react"
import {getListeById, getRecettes, saveListe} from "../../api/ApiRecettes";
import {Dropdown} from "react-materialize"
import M from "materialize-css"

const DetailCourse = ({id}) => {
    const [nom, setNom] = useState(id);
    const [recettes, setRecettes] = useState([])
    const [toutesRecettes, setToutesRecettes] = useState([])
    const [viewIngredients, setViewIngredients] = useState(<></>)
    const [firstRender, setFirstRender] = useState(true)
    useEffect(() => {
        getListeById(id).then(course => {
            setNom(course.nom);
            setRecettes(course.recettes)
        })
        getRecettes().then(res => {
            setToutesRecettes(res);
        });
    }, [id]);

    useEffect(() => {
        if (firstRender) {
            setFirstRender(false)
        } else {
            // Sauvegarder a chaque modification des recettes
            saveListe(id, {
                nom: nom,
                recettes: recettes
            }).then(() => M.toast({html: "Modifications sauvegardées"}))

            if (recettes.length) {
                let ingredients = [];
                recettes.forEach((recette) => {
                    recette.ingredients.forEach((ingredient) => {
                        ingredients[ingredient.name] = (isNaN(ingredient.qte + ingredients[ingredient.name]) ? ingredient.qte : ingredient.qte + ingredients[ingredient.name]);
                    })
                })
                console.log(ingredients)
                setViewIngredients(Object.keys(ingredients).map((ingredient, index) => {
                    return <li key={index} className="collection-item">
                        {ingredient}<span className="badge teal-text">{ingredients[ingredient]}</span>
                    </li>
                }))
            } else {
                setViewIngredients(<em className="flow-text"> Cette liste de courses est vide, ajoutez des recettes pour
                    l'alimenter</em>)
            }
        }

    }, [recettes])
    return (<div className={"container"}>
        <h3 className={"center"}>{nom}</h3>
        <div className="row">
            <div className="col m5 s12">
                <h4 className={"center"}>Recettes</h4>
                <ul className="collection">
                    {/*Pour chaque recette, faire une ligne correspondante*/}
                    {recettes.map((recette, index) => {
                        return <li key={index} className="collection-item">
                            {recette.name}
                            <a
                                href="#!"
                                onClick={() => {
                                    setRecettes(recettes.filter(rec => rec.id !== recette.id))
                                }}
                                className="material-icons white red-text right"
                            >remove</a>
                        </li>
                    })}

                </ul>
                <div className="center">
                    {/*    Dropdown pour l'ajout d'une recette    */}
                    <Dropdown
                        trigger={<span className={"btn waves-effect waves-light " + (!recettes.length ? "pulse" : "")}>Ajouter une recette <i
                            className="material-icons">arrow_drop_down</i></span>}>
                        {toutesRecettes.map((recette) => <span key={recette.id}
                                                               onClick={() => setRecettes([...recettes, recette])}>{recette.name}</span>)}
                    </Dropdown>
                </div>
            </div>
            <div className="col m5 offset-m2 s12">
                <h4 className={"center"}>Ingrédients</h4>
                <ul className="collection">
                    {viewIngredients}
                </ul>
            </div>
        </div>
    </div>)
}
export default DetailCourse