package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.Item;

public interface ItemService {

	List<Item> getItems();
	
}
