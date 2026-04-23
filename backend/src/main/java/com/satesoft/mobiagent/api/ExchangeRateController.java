package com.satesoft.mobiagent.api;

import com.satesoft.mobiagent.domain.ExchangeRate;
import com.satesoft.mobiagent.domain.ExchangeRateRepository;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/exchange-rates")
public class ExchangeRateController {
    private final ExchangeRateRepository rates;
    public ExchangeRateController(ExchangeRateRepository rates) { this.rates = rates; }
    @GetMapping public List<ExchangeRate> list() { return rates.findAll(); }
    @PostMapping public ExchangeRate create(@RequestBody ExchangeRate rate) { rate.setUpdatedAt(Instant.now()); return rates.save(rate); }
    @PutMapping("/{id}") public ExchangeRate update(@PathVariable Long id, @RequestBody ExchangeRate input) { ExchangeRate r = rates.findById(id).orElseThrow(); r.setFromCurrency(input.getFromCurrency()); r.setToCurrency(input.getToCurrency()); r.setRate(input.getRate()); r.setUpdatedAt(Instant.now()); return rates.save(r); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { rates.deleteById(id); }
}
