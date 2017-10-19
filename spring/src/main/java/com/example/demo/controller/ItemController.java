package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Item;
import com.example.demo.service.ItemService;

@RestController
@RequestMapping("/api")
public class ItemController {
	
	@Autowired
	private ItemService itemService;
	
	@RequestMapping("/items") 
	public List<Item> getItems() {
		return itemService.getItems(); 
	}
	
}
