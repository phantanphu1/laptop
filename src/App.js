import logo from './logo.svg';
import './App.css';
import Home from './pages/home/home';
import Contact from './pages/contact/contact';
import Introdouce from './pages/Introduce/Introduce';
import {Switch,Route,BrowserRouter} from 'react-router-dom';
import Login from './pages/login/login'; 
import NotFoundPage from './pages/notFoud/notFoud';
import Register from './pages/register/register';
import ProductDetail from './pages/productDetail/productDetail';
import Footer from './components/footer/footer';
import Buy from './components/buy/buy';
import Cart from './pages/cart/cart';
import History from './pages/history/history';
import ManageOrder from './pages/admin/manageOrder';
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/laptop' exact component={Home}/>
        <Route path='/introdouce' exact component={Introdouce}/>
        <Route path='/contact' exact component={Contact}/>
        <Route path='/login' exact component={Login}/>
        <Route path='/register' exact component={Register}/>
        <Route path='/product/:id' exact component={ProductDetail}/>
        <Route path='/footer' exact component={Footer}/>
        <Route path='/buy/:id' exact component={Buy}/>
        <Route path='/history/:userid' exact component={History}/>
        <Route path='/cart/:userid' exact component={Cart}/>
        <Route path='/admin/order' exact component={ManageOrder}/>

        <Route component={NotFoundPage}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
