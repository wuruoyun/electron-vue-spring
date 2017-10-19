package com.example.demo.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.Item;
import com.example.demo.service.ItemService;

@Service("itemService")
public class ItemServiceImpl implements ItemService {

	private List<Item> items = new ArrayList<>(); 

	public ItemServiceImpl() {
		items.add(new Item(0, "Item 1"));
		items.add(new Item(1, "Item 2"));
		items.add(new Item(2, "Item 3"));
	}

	@Override
	public List<Item> getItems() {
		return items;
	}

}
