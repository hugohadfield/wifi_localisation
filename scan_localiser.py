
import json
import warnings
import datetime
import nmcli

from typing import List, Optional, Tuple, Dict


def hash_network(network_data) -> int:
	return hash(network_data.ssid + network_data.bssid)


def get_wifi() -> List:
	try:
		nmcli.device.wifi_rescan()
	except Exception as e:
		pass
	wifi_data = nmcli.device.wifi()
	return wifi_data


def get_wifi_hashes() -> List[int]:
	hash_list = []
	wifi_networks = get_wifi()
	for wifi in wifi_networks:
		hash_network(wifi)
	return hash_list


def save_hash_dict_as_json(hash_dict: Dict[int, List[Tuple[float, float]]], filename: str = "hash_dict.json"):
	with open(filename, "w") as f:
		json.dump(hash_dict, f)


def load_hash_dict_from_json(filename: str = "hash_dict.json") -> Dict[str, List[Tuple[float, float]]]:
	with open(filename, "r") as f:
		return json.load(f)


class GlobalLocaliser:
	def __init__(self):
		self.hash_dict: Dict[int, List[Tuple[float, float]]] = {}

	def scan(self):
		"""
		Scan the wifi networks
		"""
		networks = get_wifi()
		return networks

	def locate(self) -> Optional[Tuple[float, float]]:
		"""
		Locate the device using the wifi hashes
		"""
		hash_list = get_wifi_hashes()
		locations = []
		for hash in hash_list:
			location = self.retrieve(hash)
			if location is not None:
				locations.append(location)
		if len(locations) == 0:
			return None
		average_location = [sum(x) / len(locations) for x in zip(*locations)]
		return average_location
		
	def retrieve(self, hash: int) -> Optional[Tuple[float, float]]:
		"""
		Retrieve the location of a hash
		"""
		if hash in self.hash_dict:
			return self.hash_dict[hash]
		return None

	def scan_and_update(self, localisation: Tuple[float, float]):
		"""
		Scan the wifi networks and update the hash_dict
		"""
		networks = self.scan()
		for network in networks:
			hash = hash_network(network)
			self.update(hash, localisation)

	def update(self, hash: int, localisation: Tuple[float, float]):
		"""
		Update the hash_dict with a new hash and localisation
		"""
		if hash not in self.hash_dict:
			self.hash_dict[hash] = [localisation]
		else:
			self.hash_dict[hash].append(localisation)

	def load(self, filename: str = "hash_dict.json"):
		"""
		Load the hash_dict from the json file
		"""
		try:
			self.hash_dict = load_hash_dict_from_json(filename)
		except Exception as e:
			self.hash_dict = {}
			warnings.warn(f"Could not load hash_dict from {filename}")

	def save(self, filename: str = "hash_dict.json"):
		"""
		Save the hash_dict to the json file
		"""
		save_hash_dict_as_json(self.hash_dict, filename)

	def __repr__(self):
		return f"GlobalLocaliser(hash_dict={self.hash_dict})"


if __name__ == "__main__":
	localiser = GlobalLocaliser()
	networks = localiser.scan()
	for n in networks:
		print(n, hash_network(n))
	