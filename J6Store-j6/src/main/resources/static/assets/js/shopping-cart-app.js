const app = angular.module("shopping-cart-app", []);

app.controller("shopping-cart-ctrl", function($scope, $http){
	$scope.cart = {
		
		items : [],
		//thêm sản phẩm vào giỏ hàng
		add(id){//dua vao id de kiem tra
			var item = this.items.find(item => item.id == id);//tim mat hang co cung id
			if(item){
				console.log(item);
				item.qty++;
				this.saveTolocalStorage();
			}else{//tai sp tren server ve thong qua resp
				$http.get(`/rest/products/${id}`).then(resp =>{
					console.log(resp);
					resp.data.qty = 1;//dat so luong
					this.items.push(resp.data);//them vao danh sach mawt hang da chon
					this.saveToLocalStorage();
				})
			}
		},
		//xoá sản phẩm khỏi giỏ hàng
		remove(id){
			var index = this.items.findIndex(item => item.id == id);
			this.items.splice(index, 1);
			this.saveToLocalStorage();
		},
		//xoá sạch các mặt hàng trong giỏ
		clear(){
			this.items = []
			this.saveToLocalStorage();
		},
		//tính thành tiền của 1 sản phẩm
		amt_of(item){},
		//tính tổng số lượng các mặt hàng trong giỏ
		get count(){
			return this.items
			.map(item => item.qty)
			.reduce((total, qty) =>total += qty, 0);
		},
		//tổng thành tiền các mặt hàng trong giỏ
		get amount(){
			return this.items
			.map(item => item.qty * item.price)
			.reduce((total, qty) => total += qty, 0);
		},
		//lưu giỏ hàng vào local storage
		saveToLocalStorage(){
			var json = JSON.stringify(angular.copy(this.items));//doi san pham => jsono 
			localStorage.setItem("cart", json);//luu vao local co ten la cart
		},
		//Đọc giỏ hàng từ local storage
		loadFormLocalStorage(){
			var json = localStorage.getItem("cart");
			this.items = json ? JSON.parse(json) : [];
		}
	}
	
	$scope.cart.loadFormLocalStorage();//tai laij local hien thi tren cart
	
	$scope.order = {
		createDate: new Date(),
		address:"",
		account:{username:$("#username").text()},
		get orderDetails(){
			return $scope.cart.items.map(item =>{
				return{
					product:{id: item.id},
					price: item.price,
					quantity: item.qty
				}
			});
		},
		purchase(){
			var order = angular.copy(this);
			//thực hiện đặt hàng
			$http.post("/rest/order", order).then(resp =>{
				alert("Đặt hàng thành công!");
				$scope.cart.clear();
				location.href="/order/detail/" + resp.data.id;
			}).catch(error =>{
				alert("Đặt hàng lỗi!")
				console.log(error)
			})
		}
	}
})