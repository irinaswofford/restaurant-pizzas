import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
class Toppings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toppings: [],
            resultArray: []
        }
        this.getData = this.getData.bind(this);
    };

    componentDidMount() {
        this.getData();
    };

    getData = () => {
        fetch('pizzas.json')
            .then(response => response.json())
            .then(rawDataFromAPI_Pizzas => {
                //console.log('Data from Api', rawDataFromAPI_Pizzas);

                // rawDataFromAPI_Pizzas = array of PIZZAS
                let ObjectLiteral_Result = {
                    // "mozzarella_cheese;bacon;beef;onions;pineapple": 50, // occurrences
                    // "sausage;pepperoni": 6
                };

                // ALL THE PIZZAS
                rawDataFromAPI_Pizzas.forEach((pizza, index) => {

                    // un-pack toppings from pizza
                    let list_of_toppings_for_a_pizza = pizza["toppings"];

                    // make list into string
                    let STRING_list_of_toppings_for_a_pizza = "";
                    let semicolon = "";
                    list_of_toppings_for_a_pizza.forEach((topping, index) => {
                        topping = (topping || "").replace(/ /g, "_");
                        STRING_list_of_toppings_for_a_pizza += semicolon + topping;
                        semicolon = ";";
                    });

                    // work 
                    if (!(STRING_list_of_toppings_for_a_pizza in ObjectLiteral_Result)) {
                        ObjectLiteral_Result[STRING_list_of_toppings_for_a_pizza] = 1;
                    }
                    else {

                        let value_topping_combination_count = ObjectLiteral_Result[STRING_list_of_toppings_for_a_pizza];
                        value_topping_combination_count++;
                        ObjectLiteral_Result[STRING_list_of_toppings_for_a_pizza] = value_topping_combination_count;
                    }
                });

                //console.log("ObjectLiteral_Result", ObjectLiteral_Result);

                // create result array from result dictionary
                let resultArray = [];
                for (let toppingCombinationString in ObjectLiteral_Result) {
                    let occurrenceCount = ObjectLiteral_Result[toppingCombinationString];
                    let obj = {
                        "toppingCombination": toppingCombinationString,
                        "occurrenceCount": occurrenceCount
                    };
                    resultArray.push(obj);
                }

                // sort resault array
                resultArray.sort((a, b) => {
                    // Use toUpperCase() to ignore character casing
                    const bandA = a.occurrenceCount;
                    const bandB = b.occurrenceCount;

                    let comparison = 0;
                    if (bandA > bandB) {
                        comparison = -1;
                    } else if (bandA < bandB) {
                        comparison = 1;
                    }
                    return comparison;
                });

                // only first 20
                resultArray = resultArray.slice(0, 20);

                // print rersults
                this.setState({
                    resultArray: resultArray
                })

            }); //end fetch callback
    };

    render() {
        return (
            <div>
                <Container className="containerMenuUI">
                    <Row>
                        <Col sm="12" md="12" className="heading">
                            Most popular Pizza topping combinations
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="1" md="1" className="containerMenuUI_th">
                            Rank
                        </Col>
                        <Col sm="7" md="7" className="containerMenuUI_th">
                            Topping Combination
                        </Col>
                        <Col sm="4" md="4" className="containerMenuUI_th">
                            Occurrences
                        </Col>
                    </Row>

                    {this.state.resultArray.map((item, index) => {

                        return (
                            <Row key={index}>
                                <Col sm="1" md="1" className="containerMenuUI_col">
                                    <span>{index + 1}</span>
                                </Col>
                                <Col sm="7" md="7" className="containerMenuUI_col">
                                    <span className="breakWord"> {item["toppingCombination"]}</span>
                                </Col>
                                <Col sm="4" md="4" className="containerMenuUI_col">
                                    <span>{item["occurrenceCount"]}</span>
                                </Col>
                            </Row>

                        );

                    })}

                </Container>
            </div>)
    }
}

export default Toppings;
