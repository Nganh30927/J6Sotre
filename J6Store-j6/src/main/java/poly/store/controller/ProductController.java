package poly.store.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import poly.store.entity.Product;
import poly.store.service.ProductService;

@Controller
public class ProductController {
	@Autowired
	ProductService productService;
	
	@RequestMapping("/product/list")
	public String list(Model model, @RequestParam("cid") Optional<String> cid) {//loc sp theo loai theo tham so cid
		if(cid.isPresent()) {//neu co => truy xuat theo ma loai
			List<Product> list = productService.findByCategoryId(cid.get());
			model.addAttribute("items", list);
		}
		else {// truy xuat tat ca
			List<Product> list = productService.findAll();
			model.addAttribute("items", list);
		}
		
		return "product/list";
	}
	
	@RequestMapping("/product/detail/{id}")//dua vao id chuyen tu csdl => hien thi giao dien
	public String detail(Model model, @PathVariable("id") Integer id) {//Lấy mã sp thông qua pqth
		Product item = productService.findById(id);//truy vân de lay thong tin ma
		model.addAttribute("item", item);//dua sp vao model
		return "product/detail";
	}
}
