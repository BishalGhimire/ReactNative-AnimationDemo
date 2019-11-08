import React, {Component} from 'react';
import {
    View, 
    Animated, 
    Text,
    PanResponder,
    Dimensions,
    LayoutAnimation,
    UIManager,
    } from 'react-native';


    const ScreenSize = Dimensions.get('window').width;
    const SwipedThreshold = 0.35 * ScreenSize;
    const timeSwiped = 250;
class Deck extends Component {
    static defaultProps = {
        onSwipeRight: () =>{},
        onSwipeLeft: () => {}
    }

    constructor(props){
        super(props);
        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
               position.setValue({x: gesture.dx, y: gesture.dy})
            },
            onPanResponderRelease: (event, gesture) => {
                if(gesture.dx > SwipedThreshold){
                    this.SwipeCard('right');
                }
                else if(gesture.dx < - SwipedThreshold){
                    this.SwipeCard('left')
                }
                else{
                    this.resetPosition();
                }
            }

        })

        this.state = {
            panResponder, position, index :0
        };
    }
    SwipeCard = (direction) => {
        const x = direction === 'right' ? ScreenSize : -ScreenSize;
        Animated.timing(this.state.position, {
            toValue: {x, y: 0},
            duration: timeSwiped
        }).start(() => {
            this.onSwipeComplete(direction);
        });
    }
    componentWillReceiveProps(nextProps){
        //lifecycle method called whenever component is about to re-render with new set of props

        if(nextProps.data !== this.props.data){
            this.setState({index: 0})
        }

    }

    componentWillUpdate(){
        // this is strictly just for anroid devices
        //this updates the postion of the cards smoothly after every swipe
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.spring();
    }


    onSwipeComplete = (direction) => {
        const { onSwipeLeft, onSwipeRight } = this.props;
        const item = this.props.data[this.state.data];
        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        this.state.position.setValue({ x: 0, y: 0})
        this.setState({index: this.state.index + 1})
    }
    resetPosition = () => {
        Animated.spring(this.state.position, {
            toValue: {x: 0, y: 0}
        }).start();
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
        if(this.state.index>= this.props.data.length){
            return this.props.renderNoMoreCards();
        }
        return this.props.data.map((item, ind) =>{
            if(ind < this.state.index){ return null}
            if( ind == this.state.index){
                return(
                    <Animated.View 
                    key = {item.id}
                   style ={[this.getCardStyle(), styles.cardStyle]}
                   {...this.state.panResponder.panHandlers}>
                    {this.props.renderCard(item)}
                   </Animated.View>
                       )
            }
           
            return (
                <Animated.View key = {item.id} style = {[styles.cardStyle, {top: 10*(ind-this.state.index)}]}>
               { this.props.renderCard(item)}

                </Animated.View>
                )
        }).reverse();
    }
    render(){
        return(
            <View >
          
                {this.renderCards()}
            </View>
        )
    }
}
const styles = {
    cardStyle : {
        position: 'absolute',
        width: ScreenSize
    }
}

export default Deck;