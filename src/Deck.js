import React, {Component} from 'react';
import {
    View, 
    Animated, 
    Text,
    PanResponder,
    Dimensions,
    ScrollView
    } from 'react-native';


    const ScreenSize = Dimensions.get('window').width;
class Deck extends Component {

    constructor(props){
        super(props);
        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
               position.setValue({x: gesture.dx, y: gesture.dy})
            },
            onPanResponderRelease: () => {}

        })

        this.state = {
            panResponder, position
        };
    }
    getCardStyle =() => {

        const rotate = this.state.position.x.interpolate({
            inputRange: [-ScreenSize *1.5, 0, ScreenSize *1.5],
            outputRange : ['-120deg', '0deg', '120deg']
        })
       return {
           ...this.state.position.getLayout(),
           transform: [{rotate: rotate}]
        }
    }

    renderCards = () => {
        return this.props.data.map((item, index) =>{
            if(index === 0){
                return(
             <Animated.View 
             key = {item.id}
            style ={this.getCardStyle()}
            {...this.state.panResponder.panHandlers}>
             {this.props.renderCard(item)}
            </Animated.View>
                )
            }
            return this.props.renderCard(item)
        })
    }
    render(){
        return(
            <View >
          
                {this.renderCards()}
            </View>
        )
    }
}

export default Deck;